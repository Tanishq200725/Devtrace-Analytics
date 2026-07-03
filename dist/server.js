"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const supabase_js_1 = require("@supabase/supabase-js");
const gitService_1 = require("./gitService");
const userService_1 = require("./userService");
const emailService_1 = require("./emailService");
// Initialize environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const gitService = new gitService_1.GitService();
const userService = new userService_1.UserService();
const emailService = new emailService_1.EmailService();
// State Cache
let activeRepoPath = '';
let activeRepoUrl = '';
// Setup Supabase Client if configured
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
let supabaseClient = null;
if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project-id.supabase.co') {
    try {
        supabaseClient = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
        console.log(`[Supabase Engine] Connected successfully to client endpoint: ${supabaseUrl}`);
    }
    catch (err) {
        console.warn(`[Supabase Engine Warning] Connection initialization failed: ${err.message}`);
    }
}
else {
    console.log(`[Supabase Engine] No custom credentials found. Running in local file logging fallback mode.`);
}
// Enable JSON parsing middleware
app.use(express_1.default.json());
// Serve static frontend assets
app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
// ==========================================
// Authentication APIs
// ==========================================
// 1. Sign Up API: Validate entries and dispatch temporary verification OTP code
app.post('/api/auth/signup', (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
        return res.status(400).json({ error: 'Email/Mobile and password are required.' });
    }
    const isEmail = identifier.includes('@');
    const isMobile = /^\+?[0-9]{10,14}$/.test(identifier);
    if (!isEmail && !isMobile) {
        return res.status(400).json({ error: 'Please enter a valid Gmail address or mobile number.' });
    }
    const existingUser = userService.findUser(identifier);
    if (existingUser) {
        return res.status(400).json({ error: 'An account is already registered with this email or mobile number.' });
    }
    try {
        const otp = userService.initiateSignup(identifier, password);
        return res.status(200).json({
            message: 'Verification OTP code dispatched successfully.',
            identifier
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
// 2. OTP Verification API: Check code and return pending status parameters (for choosing username)
app.post('/api/auth/verify-otp', (req, res) => {
    const { identifier, code } = req.body;
    if (!identifier || !code) {
        return res.status(400).json({ error: 'Identifier and 6-digit OTP code are required.' });
    }
    try {
        const pending = userService.verifyOtpAndGetPending(identifier, code);
        console.log(`[Authentication Suite] OTP verified successfully for pending registration: ${identifier}`);
        return res.status(200).json({
            message: 'OTP verified. Proceed to username configuration.',
            identifier: pending.identifier,
            passwordHash: pending.passwordHash
        });
    }
    catch (err) {
        return res.status(400).json({ error: err.message || 'OTP verification failed.' });
    }
});
// 3. Choose Username API: Check uniqueness and persist account
app.post('/api/auth/choose-username', (req, res) => {
    const { identifier, passwordHash, username } = req.body;
    if (!identifier || !passwordHash || !username) {
        return res.status(400).json({ error: 'Required signup parameters are missing.' });
    }
    const cleanUsername = username.trim();
    if (cleanUsername.length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
    }
    if (userService.isUsernameTaken(cleanUsername)) {
        const suggestions = userService.generateUsernameSuggestions(cleanUsername);
        return res.status(400).json({
            error: 'Username already taken.',
            suggestions
        });
    }
    try {
        const user = userService.createAccount(identifier, passwordHash, cleanUsername);
        console.log(`[Authentication Suite] New user account finalized: ${user.username} (${user.identifier})`);
        return res.status(201).json({
            message: 'Account successfully registered and active.',
            token: Buffer.from(`${user.identifier}:${Date.now()}`).toString('base64'),
            identifier: user.identifier,
            username: user.username,
            membership: user.membership,
            tokens_remaining: user.tokens_remaining,
            chat_queries_remaining: user.chat_queries_remaining ?? 5
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
// 4. Login API: Verify password matches registered username (supporting Backwards Compatibility & Owner Bypass)
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    try {
        const isValid = userService.verifyCredentialsByUsername(username, password);
        if (!isValid) {
            return res.status(401).json({ error: 'Incorrect username or password combination.' });
        }
        const user = userService.findUserByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Failed to retrieve authenticated profile.' });
        }
        const loginId = user.username || user.identifier;
        console.log(`[Authentication Suite] Session authorized: ${loginId} [Plan: ${user.membership}]`);
        return res.status(200).json({
            message: 'Authorization successful.',
            token: Buffer.from(`${user.identifier}:${Date.now()}`).toString('base64'),
            identifier: user.identifier,
            username: user.username || user.identifier,
            membership: user.membership,
            tokens_remaining: user.tokens_remaining,
            chat_queries_remaining: user.chat_queries_remaining ?? 5
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
// 5. Forgot Password: Ingest Gmail and send Recovery OTP key
app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Gmail address is required.' });
    }
    const user = userService.findUserByEmail(email);
    if (!user) {
        return res.status(404).json({ error: 'No account registered with this Gmail address.' });
    }
    try {
        const code = userService.initiateRecovery(email);
        console.log(`[Authentication Suite] Recovery OTP passcode generated for: ${email}`);
        return res.status(200).json({
            message: 'Recovery Access Code dispatched to your console/Gmail.',
            email
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
// 6. Verify Recovery Code: Validate OTP and log user in directly
app.post('/api/auth/verify-recovery', (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
        return res.status(400).json({ error: 'Email and 6-digit recovery code are required.' });
    }
    const isValid = userService.verifyRecovery(email, code);
    if (!isValid) {
        return res.status(400).json({ error: 'Incorrect or expired recovery code. Please check your console.' });
    }
    const user = userService.findUserByEmail(email);
    if (!user) {
        return res.status(404).json({ error: 'Failed to retrieve recovery profile.' });
    }
    console.log(`[Authentication Suite] Recovery authorized session for: ${user.identifier}`);
    return res.status(200).json({
        message: 'Recovery validation successful. Direct session authorized.',
        token: Buffer.from(`${user.identifier}:${Date.now()}`).toString('base64'),
        identifier: user.identifier,
        username: user.username || user.identifier,
        membership: user.membership,
        tokens_remaining: user.tokens_remaining,
        chat_queries_remaining: user.chat_queries_remaining ?? 5
    });
});
// ==========================================
// Billing & Suggestions APIs
// ==========================================
// 1. Upgrade Plan API
app.post('/api/membership/upgrade', async (req, res) => {
    const { identifier, tier } = req.body;
    if (!identifier || !tier) {
        return res.status(400).json({ error: 'Identifier and tier details are required.' });
    }
    try {
        const updatedUser = userService.upgradeMembership(identifier, tier);
        await emailService.sendUpgradeEmail(identifier, tier);
        return res.status(200).json({
            message: 'Billing plan upgraded successfully.',
            membership: updatedUser.membership,
            tokens_remaining: updatedUser.tokens_remaining
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
// 2. Suggestion Form API
app.post('/api/support/suggestion', async (req, res) => {
    const { email, suggestion } = req.body;
    if (!email || !suggestion) {
        return res.status(400).json({ error: 'Email and suggestion text are required.' });
    }
    try {
        console.log(`[Suggestions Box] Received advice from: ${email}`);
        const logDir = path_1.default.join(__dirname, '../suggestions');
        if (!fs_1.default.existsSync(logDir)) {
            fs_1.default.mkdirSync(logDir, { recursive: true });
        }
        const logPath = path_1.default.join(logDir, `feedback-${Date.now()}.json`);
        fs_1.default.writeFileSync(logPath, JSON.stringify({ email, suggestion, date: new Date().toISOString() }, null, 2));
        await emailService.sendSuggestionToOwner(email, suggestion);
        await emailService.sendThankYouToUser(email, suggestion);
        return res.status(201).json({ message: 'Thank you! Your feedback has been registered.' });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
// ==========================================
// Git Ingestion & Analytics APIs
// ==========================================
app.post('/api/scan', async (req, res) => {
    const { url, identifier } = req.body;
    if (!url || !identifier) {
        return res.status(400).json({ error: 'Repository URL and session identifier are required.' });
    }
    try {
        const user = userService.findUser(identifier);
        if (!user) {
            return res.status(401).json({ error: 'Session unauthorized. Please log in again.' });
        }
        if (user.tokens_remaining <= 0) {
            return res.status(403).json({ error: 'Excavation credits exhausted. Please upgrade your plan in the Pricing portal to continue.' });
        }
        console.log(`[Scan Engine] User: ${user.identifier} (${user.membership}). Tokens remaining: ${user.tokens_remaining}`);
        const repoPath = await gitService.cloneRepository(url);
        const commits = await gitService.getCommits(repoPath);
        activeRepoPath = repoPath;
        activeRepoUrl = url;
        userService.deductToken(identifier);
        const updatedUser = userService.findUser(identifier);
        return res.status(200).json({
            message: 'Repository scanned successfully.',
            repoUrl: url,
            commitsCount: commits.length,
            latestCommit: commits[0] || null,
            tokens_remaining: updatedUser?.tokens_remaining || 0
        });
    }
    catch (err) {
        console.error(`[Scan Engine Error] Ingestion failed:`, err.message);
        return res.status(500).json({ error: err.message || 'Failed to scan repository.' });
    }
});
app.get('/api/commits', async (req, res) => {
    if (!activeRepoPath) {
        return res.status(400).json({ error: 'No active repository scanned. Ingest a repo URL first.' });
    }
    try {
        const commits = await gitService.getCommits(activeRepoPath);
        return res.status(200).json({ commits });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
app.get('/api/files', async (req, res) => {
    const { commit } = req.query;
    if (!activeRepoPath) {
        return res.status(400).json({ error: 'No active repository scanned.' });
    }
    if (!commit || typeof commit !== 'string') {
        return res.status(400).json({ error: 'Commit parameter is required.' });
    }
    try {
        const files = await gitService.getChangedFiles(activeRepoPath, commit);
        return res.status(200).json({ files });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
app.get('/api/diff', async (req, res) => {
    const { commit, file } = req.query;
    if (!activeRepoPath) {
        return res.status(400).json({ error: 'No active repository scanned.' });
    }
    if (!commit || typeof commit !== 'string' || !file || typeof file !== 'string') {
        return res.status(400).json({ error: 'Commit and file query parameters are required.' });
    }
    try {
        const contents = await gitService.getFileContents(activeRepoPath, commit, file);
        return res.status(200).json({
            file,
            commit,
            originalCode: contents.original,
            modifiedCode: contents.modified
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
app.post('/api/support/ticket', async (req, res) => {
    const { subject, description, telemetry } = req.body;
    if (!subject || !description) {
        return res.status(400).json({ error: 'Subject and description are required.' });
    }
    const ticketId = `TKT-${Math.floor(Math.random() * 90000 + 10000)}`;
    const ticketPayload = {
        ticket_id: ticketId,
        subject,
        description,
        telemetry: telemetry ? JSON.stringify(telemetry) : null,
        created_at: new Date().toISOString()
    };
    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('support_tickets')
                .insert([ticketPayload]);
            if (error)
                throw error;
            console.log(`[Supabase Persistence] Ticket ${ticketId} saved to database table 'support_tickets'.`);
            return res.status(201).json({
                message: 'Ticket recorded in cloud database register',
                ticketId,
                destination: 'supabase',
                timestamp: ticketPayload.created_at
            });
        }
        catch (dbErr) {
            console.warn(`[Supabase Ingestion Failed] Falling back to local logging. Error: ${dbErr.message}`);
        }
    }
    try {
        const localLogDir = path_1.default.join(__dirname, '../support_tickets');
        if (!fs_1.default.existsSync(localLogDir)) {
            fs_1.default.mkdirSync(localLogDir, { recursive: true });
        }
        const localFilePath = path_1.default.join(localLogDir, `ticket-${ticketId}.json`);
        fs_1.default.writeFileSync(localFilePath, JSON.stringify(ticketPayload, null, 2));
        console.log(`[Local Logging Fallback] Saved ticket log locally to: ${localFilePath}`);
        return res.status(201).json({
            message: 'Ticket recorded (Supabase inactive. Logged locally in workspace).',
            ticketId,
            destination: 'local_file',
            timestamp: ticketPayload.created_at
        });
    }
    catch (logErr) {
        console.error(`[Logging Core Error] Local log write failed:`, logErr.message);
        return res.status(500).json({ error: 'Failed to record support ticket.' });
    }
});
// Helper to recursively walk files
const getAllFiles = (dir, fileList = []) => {
    if (!fs_1.default.existsSync(dir))
        return fileList;
    const files = fs_1.default.readdirSync(dir);
    for (const file of files) {
        if (file === '.git' || file === 'node_modules' || file === 'dist')
            continue;
        const name = path_1.default.join(dir, file);
        if (fs_1.default.statSync(name).isDirectory()) {
            getAllFiles(name, fileList);
        }
        else {
            fileList.push(name);
        }
    }
    return fileList;
};
// 3. Semantic Code Search and Diagnostics API
app.post('/api/diagnostics/query', (req, res) => {
    const { query, connectedRepos } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Query text is required.' });
    }
    const cleanQuery = query.toLowerCase().trim();
    const stopWords = ['how', 'what', 'where', 'to', 'is', 'a', 'an', 'the', 'in', 'of', 'for', 'on', 'with', 'about', 'and', 'or', 'can', 'you', 'show', 'explain', 'tell', 'me', 'problem', 'error', 'bug', 'code'];
    const keywords = cleanQuery.split(/[^a-z0-9]/).filter((word) => word.length > 2 && !stopWords.includes(word));
    console.log(`[AI Search Core] Incoming query: "${query}" (Keywords: ${keywords.join(', ')})`);
    let matchedFile = null;
    let highestScore = 0;
    let codeSnippet = '';
    let relativePath = '';
    if (activeRepoPath && fs_1.default.existsSync(activeRepoPath) && keywords.length > 0) {
        try {
            const files = getAllFiles(activeRepoPath);
            for (const file of files) {
                let score = 0;
                const filename = path_1.default.basename(file).toLowerCase();
                // 1. Filename matches
                keywords.forEach((keyword) => {
                    if (filename.includes(keyword)) {
                        score += 15; // High weight for filename match
                    }
                });
                // 2. Content matches
                const content = fs_1.default.readFileSync(file, 'utf-8');
                const contentLower = content.toLowerCase();
                keywords.forEach((keyword) => {
                    const regex = new RegExp(keyword, 'g');
                    const matches = contentLower.match(regex);
                    if (matches) {
                        score += matches.length * 2; // Weight per occurrence
                    }
                });
                if (score > highestScore) {
                    highestScore = score;
                    matchedFile = file;
                }
            }
            if (matchedFile) {
                const fullContent = fs_1.default.readFileSync(matchedFile, 'utf-8');
                relativePath = path_1.default.relative(activeRepoPath, matchedFile);
                // Find relevant snippet around matched keyword
                const lines = fullContent.split('\n');
                let focusLine = 0;
                for (let i = 0; i < lines.length; i++) {
                    const lineLower = lines[i].toLowerCase();
                    const hasKeyword = keywords.some((k) => lineLower.includes(k));
                    if (hasKeyword) {
                        focusLine = i;
                        break;
                    }
                }
                const start = Math.max(0, focusLine - 10);
                const end = Math.min(lines.length, focusLine + 15);
                codeSnippet = lines.slice(start, end).join('\n');
            }
        }
        catch (err) {
            console.error(`[AI Search Core Error] File walk failed:`, err.message);
        }
    }
    // Cross-repository recommendation filter
    let recommendedRepos = [];
    if (Array.isArray(connectedRepos) && keywords.length > 0) {
        recommendedRepos = connectedRepos.filter((repo) => {
            const name = (repo.name || '').toLowerCase();
            const desc = (repo.description || '').toLowerCase();
            return keywords.some((keyword) => name.includes(keyword) || desc.includes(keyword));
        });
    }
    // Return generated diagnostics if matched, else fallback prompt
    if (matchedFile) {
        // Generate simulated dynamic edge-case checks and test metrics based on matched file type
        const isTsOrJs = matchedFile.endsWith('.ts') || matchedFile.endsWith('.js');
        const isJson = matchedFile.endsWith('.json');
        let edgeCases = '';
        let testCases = '';
        let explanation = '';
        if (isTsOrJs) {
            explanation = `The system matched your query in the code file [${relativePath}]. This file manages active execution logical functions matching your query criteria. It uses asynchronous processes, standard imports, and exports structured parameters.`;
            edgeCases = `1. **Parameter Null-Reference Checks:** If arguments are passed as undefined, runtime exceptions could occur.
2. **Asynchronous Timeout Issues:** If dependent APIs or file locks stall for more than 10 seconds, execution may hang.
3. **Regex Boundary Injection:** Input fields evaluated via unsanitized match structures are prone to CPU Denial of Service (ReDoS).`;
            testCases = `1. **Empty / Undefined Input Check:** Verify that calling functions with empty values returns graceful error responses instead of throwing runtime exceptions.
2. **Simulated High-Latency Delay:** Delay DB responses by 10s and verify the system handles the promise reject or times out gracefully.
3. **Invalid Parameter Types:** Pass numerical inputs to string parsers and assert type guards behave correctly.`;
        }
        else if (isJson) {
            explanation = `The query is answered by config parameters registry in [${relativePath}]. It hosts core static key-value declarations driving backend configurations.`;
            edgeCases = `1. **Invalid JSON Formatting Syntax:** Commas or missing brackets corrupt loading processes.
2. **Missing Expected Config Keys:** Key retrieval fallback errors trigger server initialization exceptions.
3. **Type Mismatch Collisions:** String inputs supplied where integers are expected (e.g. ports, limits) may break parsing services.`;
            testCases = `1. **Schema Syntax Validation:** Run schema check assertions to ensure all config nodes are parsed correctly.
2. **Missing Properties Recovery:** Delete config keys and check if retrieval scripts fallback to standard defaults.
3. **Max Numerical Boundary Limits:** Set limits to extreme bounds (e.g. port: 99999) to verify bounds validation works.`;
        }
        else {
            explanation = `The match is located in standard text markup [${relativePath}]. It outlines structure, formatting rules, or layout metrics.`;
            edgeCases = `1. **Unescaped HTML Entities:** Outputting query parameters directly in scripts exposes Cross-Site Scripting (XSS) risks.
2. **Resource Load Failures:** Missing external styles or scripts lock browser boot sequences.
3. **CSS Class Injection Collisions:** Inline variable overrides can warp layouts.`;
            testCases = `1. **DOM XSS Injection Payloads:** Input test strings containing \`<script>alert(1)</script>\` and verify output is sanitised.
2. **Fallback CSS Loading Check:** Block CDN stylesheets and verify interface falls back to responsive typography gracefully.
3. **Viewport Scale Bounds:** Resize rendering viewports to 320px width to check elements wrap.`;
        }
        return res.status(200).json({
            matched: true,
            query,
            filePath: relativePath,
            codeSnippet,
            explanation,
            edgeCases,
            testCases,
            recommendedRepos: recommendedRepos.slice(0, 3)
        });
    }
    else {
        // If no match inside repo, return recommendations
        return res.status(200).json({
            matched: false,
            query,
            filePath: null,
            codeSnippet: null,
            explanation: `No relevant files or references were found in the currently excavated repository matching your query parameters.`,
            edgeCases: null,
            testCases: null,
            recommendedRepos: recommendedRepos.slice(0, 3)
        });
    }
});
// 5. Secure Owner Admin Metrics API
app.get('/api/admin/stats', (req, res) => {
    const { identifier } = req.query;
    if (!identifier || typeof identifier !== 'string') {
        return res.status(400).json({ error: 'Auth identifier is required.' });
    }
    // Authorize Tanishq (case-insensitive check)
    const isOwner = identifier.toLowerCase() === 'tanishq' || identifier.toLowerCase() === 'tanishq@gmail.com';
    if (!isOwner) {
        return res.status(403).json({ error: 'Access denied. Owner permissions required.' });
    }
    try {
        // 1. User stats from users.json
        const users = userService.loadUsers(); // bypass TS private access rule
        const totalUsers = users.length;
        const plans = { free: 0, basic: 0, advanced: 0, elite: 0 };
        users.forEach((u) => {
            const plan = u.membership || 'free';
            if (plan in plans) {
                plans[plan]++;
            }
        });
        // 2. Read bug tickets from support_tickets/
        const tickets = [];
        const ticketsDir = path_1.default.join(__dirname, '../support_tickets');
        if (fs_1.default.existsSync(ticketsDir)) {
            const files = fs_1.default.readdirSync(ticketsDir);
            files.forEach(file => {
                if (file.endsWith('.json')) {
                    try {
                        const data = fs_1.default.readFileSync(path_1.default.join(ticketsDir, file), 'utf-8');
                        tickets.push(JSON.parse(data));
                    }
                    catch (e) { }
                }
            });
        }
        // 3. Read user suggestions from suggestions/
        const suggestions = [];
        const suggestionsDir = path_1.default.join(__dirname, '../suggestions');
        if (fs_1.default.existsSync(suggestionsDir)) {
            const files = fs_1.default.readdirSync(suggestionsDir);
            files.forEach(file => {
                if (file.endsWith('.json')) {
                    try {
                        const data = fs_1.default.readFileSync(path_1.default.join(suggestionsDir, file), 'utf-8');
                        suggestions.push(JSON.parse(data));
                    }
                    catch (e) { }
                }
            });
        }
        // 4. Count excavated folders
        let scannedReposCount = 0;
        const reposDir = path_1.default.join(__dirname, '../repos');
        if (fs_1.default.existsSync(reposDir)) {
            scannedReposCount = fs_1.default.readdirSync(reposDir).length;
        }
        return res.status(200).json({
            totalUsers,
            plans,
            tickets,
            suggestions,
            scannedReposCount
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
// 4. Global AI Copilot Assistant Chat API
app.post('/api/assistant/chat', async (req, res) => {
    const { message, identifier } = req.body;
    if (!message || !identifier) {
        return res.status(400).json({ error: 'Message and session identifier are required.' });
    }
    const user = userService.findUser(identifier);
    if (!user) {
        return res.status(401).json({ error: 'Session unauthorized. Please log in again.' });
    }
    // Check chat query limit balance
    const remaining = user.chat_queries_remaining ?? 5;
    if (user.membership === 'free' && remaining <= 0) {
        return res.status(403).json({ error: 'AI Assistant query credits exhausted. Please upgrade your plan in the Membership portal to unlock unlimited chat access.' });
    }
    const cleanMsg = message.toLowerCase().trim();
    let reply = '';
    let isMissingFeature = false;
    // Semantic Intent Checkers
    if (cleanMsg.includes('theme') || cleanMsg.includes('style') || cleanMsg.includes('color') || cleanMsg.includes('matrix') || cleanMsg.includes('dracula') || cleanMsg.includes('cyberpunk') || cleanMsg.includes('neon') || cleanMsg.includes('stripe')) {
        reply = "You can customize the coding vibe of DevTrace! Simply select a visual theme (Vercel Minimalist, Dracula, Matrix Green, Cyberpunk Neon, or Stripe Cobalt) from the selector dropdown in the navigation header bar. Free plans unlock Vercel and Dracula, while premium plans unlock Matrix, Cyberpunk, and Stripe themes.";
    }
    else if (cleanMsg.includes('scrub') || cleanMsg.includes('timeline') || cleanMsg.includes('history') || cleanMsg.includes('commit')) {
        reply = "The Historical Commit Scrubber on the dashboard lets you slide backward in time to select any of the latest 10 commits. Sliding it dynamically updates the active commit SHA and target files, letting you select exactly which codebase milestone you want to explore.";
    }
    else if (cleanMsg.includes('diff') || cleanMsg.includes('split') || cleanMsg.includes('workspace') || cleanMsg.includes('compare') || cleanMsg.includes('original') || cleanMsg.includes('modified') || cleanMsg.includes('inline')) {
        reply = "The forensics Workspace (/workspace/diff) allows you to examine side-by-side split code differences and inline unified views. You can search files in the left tree sidebar using the Search Filter. A toggle button in the header lets you switch between split and unified inline views.";
    }
    else if (cleanMsg.includes('token') || cleanMsg.includes('limit') || cleanMsg.includes('scan') || cleanMsg.includes('credit')) {
        reply = "Your scan tokens represent how many repositories you can excavate. Free profiles get 10 tokens. Upgrading to Basic refuels you with 50 tokens, and Advanced or Elite plans provide Unlimited scans.";
    }
    else if (cleanMsg.includes('search') || cleanMsg.includes('diagnostics') || cleanMsg.includes('edge case') || cleanMsg.includes('test case') || cleanMsg.includes('query')) {
        reply = "The Semantic Query & Diagnostics panel on the Dashboard lets you type natural language questions about your codebase. It highlights files, extracts code snippets, analyzes 1% edge-case vulnerabilities, and suggests test cases.";
    }
    else if (cleanMsg.includes('support') || cleanMsg.includes('ticket') || cleanMsg.includes('bug') || cleanMsg.includes('supabase') || cleanMsg.includes('log')) {
        reply = "If you encounter a bug or need developer support, go to the Support page. You can file a ticket containing local browser configuration diagnostics telemetry that is logged directly to Supabase cloud database registry or local file systems.";
    }
    else if (cleanMsg.includes('suggest') || cleanMsg.includes('feedback') || cleanMsg.includes('advice') || cleanMsg.includes('thank')) {
        reply = "Have improvement advice? Go to the Suggestions page (or click the Suggestions link in the header) to write directly to the owner, Tanishq Tyagi. Submitting a suggestion will send a thanking notification email or SMS directly to your registered contact coordinates.";
    }
    // Missing Feature match check
    else if (cleanMsg.includes('deploy') || cleanMsg.includes('host') || cleanMsg.includes('aws') || cleanMsg.includes('heroku') || cleanMsg.includes('azure') || cleanMsg.includes('firebase') || cleanMsg.includes('publish') || cleanMsg.includes('cicd') || cleanMsg.includes('ci/cd') || cleanMsg.includes('pipeline') || cleanMsg.includes('collaborate') || cleanMsg.includes('team chat') || cleanMsg.includes('group share') || cleanMsg.includes('multiuser') || cleanMsg.includes('multi-user') || cleanMsg.includes('co-author') || cleanMsg.includes('write code') || cleanMsg.includes('edit file') || cleanMsg.includes('refactor') || cleanMsg.includes('git push') || cleanMsg.includes('git commit')) {
        isMissingFeature = true;
        reply = "This feature (deployment, collaboration, or code writing/editing) is currently not supported in DevTrace. However, I have automatically logged this as an improvement suggestion and sent a copy directly to the owner, Tanishq Tyagi (tanishqtyagi78@gmail.com) so he can implement it in the website!";
    }
    else {
        reply = "Hello! I am your DevTrace AI Assistant. I can explain how to use the timeline scrubber, Monaco diff layouts, diagnostics search, suggestions box, or custom visual themes. Type your query to begin!";
    }
    try {
        if (isMissingFeature) {
            // 1. Log suggestion locally
            const logDir = path_1.default.join(__dirname, '../suggestions');
            if (!fs_1.default.existsSync(logDir)) {
                fs_1.default.mkdirSync(logDir, { recursive: true });
            }
            const logPath = path_1.default.join(logDir, `ai-copilot-missing-${Date.now()}.json`);
            fs_1.default.writeFileSync(logPath, JSON.stringify({ email: user.identifier, query: message, date: new Date().toISOString() }, null, 2));
            // 2. Dispatch email to owner mailbox
            await emailService.sendSuggestionToOwner(user.identifier, `[AI Assistant Request - Missing Feature]: ${message}`);
        }
        // Deduct credit for free plan queries
        userService.deductChatQuery(user.identifier);
        const updatedUser = userService.findUser(user.identifier);
        return res.status(200).json({
            reply,
            chat_queries_remaining: updatedUser?.chat_queries_remaining ?? 5
        });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
// Fallback all routes to index.html for SPA Client Router
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../client/index.html'));
});
// Start Express server
app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  DevTrace Server Engine Live`);
    console.log(`  Access URL: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
});
