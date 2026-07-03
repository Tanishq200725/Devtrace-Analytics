"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const USERS_FILE = path_1.default.join(__dirname, '../users.json');
class UserService {
    pendingSignups = new Map();
    // Memory cache for recovery codes (forgot password flow)
    recoveryCodes = new Map();
    constructor() {
        if (!fs_1.default.existsSync(USERS_FILE)) {
            fs_1.default.writeFileSync(USERS_FILE, JSON.stringify([]));
        }
    }
    loadUsers() {
        try {
            const data = fs_1.default.readFileSync(USERS_FILE, 'utf-8');
            return JSON.parse(data);
        }
        catch (err) {
            return [];
        }
    }
    saveUsers(users) {
        fs_1.default.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    }
    hashPassword(password) {
        return Buffer.from(password).toString('base64');
    }
    // Find user details by identifier (Email or Mobile)
    findUser(identifier) {
        const isOwner = identifier.toLowerCase() === 'tanishq' || identifier.toLowerCase() === 'tanishq@gmail.com';
        const users = this.loadUsers();
        let user = users.find(u => u.identifier.toLowerCase() === identifier.toLowerCase());
        if (isOwner) {
            if (!user) {
                user = {
                    identifier: 'tanishq@gmail.com',
                    username: 'Tanishq',
                    passwordHash: this.hashPassword('Shiv@0205'),
                    verified: true,
                    membership: 'elite',
                    tokens_remaining: 99999,
                    chat_queries_remaining: 99999,
                    created_at: new Date().toISOString()
                };
                users.push(user);
                this.saveUsers(users);
            }
            else {
                let changed = false;
                if (user.membership !== 'elite') {
                    user.membership = 'elite';
                    changed = true;
                }
                if (!user.username) {
                    user.username = 'Tanishq';
                    changed = true;
                }
                if (user.chat_queries_remaining !== 99999) {
                    user.chat_queries_remaining = 99999;
                    changed = true;
                }
                if (changed)
                    this.saveUsers(users);
            }
        }
        else if (user) {
            // Backward compatibility check for query limits field
            if (typeof user.chat_queries_remaining === 'undefined') {
                const isPaid = user.membership !== 'free';
                user.chat_queries_remaining = isPaid ? 99999 : 5;
                this.saveUsers(users);
            }
        }
        return user;
    }
    // Find user by Username (with backwards-compatibility fallback checking identifier)
    findUserByUsername(username) {
        const isOwner = username.toLowerCase() === 'tanishq';
        if (isOwner) {
            return this.findUser('tanishq@gmail.com');
        }
        const users = this.loadUsers();
        const matched = users.find(u => {
            const matchUsername = u.username && u.username.toLowerCase() === username.toLowerCase();
            const matchIdentifier = u.identifier.toLowerCase() === username.toLowerCase();
            return matchUsername || matchIdentifier;
        });
        if (matched && typeof matched.chat_queries_remaining === 'undefined') {
            return this.findUser(matched.identifier);
        }
        return matched;
    }
    // Find user by Gmail/Email
    findUserByEmail(email) {
        const users = this.loadUsers();
        const matched = users.find(u => u.identifier.toLowerCase() === email.toLowerCase());
        if (matched && typeof matched.chat_queries_remaining === 'undefined') {
            return this.findUser(matched.identifier);
        }
        return matched;
    }
    // Verify login credentials using username
    verifyCredentialsByUsername(username, secret) {
        const isOwner = username.toLowerCase() === 'tanishq';
        if (isOwner && secret === 'Shiv@0205') {
            this.findUser('tanishq@gmail.com'); // ensure created
            return true;
        }
        const user = this.findUserByUsername(username);
        if (!user)
            return false;
        return user.passwordHash === this.hashPassword(secret);
    }
    // Check if a username is already registered (case-insensitive)
    isUsernameTaken(username) {
        if (username.toLowerCase() === 'tanishq')
            return true; // reserved for owner
        const users = this.loadUsers();
        return users.some(u => u.username && u.username.toLowerCase() === username.toLowerCase());
    }
    // Generate 3 unique username suggestions that are verified to be free
    generateUsernameSuggestions(username) {
        const base = username.trim().replace(/[^a-zA-Z0-9]/g, '');
        const suggestions = [];
        const formats = [
            (b) => `${b}_dev`,
            (b) => `${b}${Math.floor(100 + Math.random() * 900)}`,
            (b) => `${b}_trace`,
            (b) => `${b}_core`,
            (b) => `dev_${b}`,
            (b) => `archaeo_${b}`
        ];
        let formatIdx = 0;
        while (suggestions.length < 3 && formatIdx < 100) {
            const fn = formats[formatIdx % formats.length];
            const candidate = fn(base);
            if (!this.isUsernameTaken(candidate) && !suggestions.includes(candidate)) {
                suggestions.push(candidate);
            }
            formatIdx++;
        }
        // Fallback simple increment suggestions if we run out of unique slots
        while (suggestions.length < 3) {
            const fallback = `${base}${Math.floor(1000 + Math.random() * 9000)}`;
            if (!this.isUsernameTaken(fallback) && !suggestions.includes(fallback)) {
                suggestions.push(fallback);
            }
        }
        return suggestions;
    }
    // Initiate Password Recovery: Generate access key and print to terminal
    initiateRecovery(email) {
        const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
        this.recoveryCodes.set(email.toLowerCase(), {
            code,
            expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
        });
        console.log(`\n======================================================`);
        console.log(`  [PASSWORD RECOVERY ENGINE]`);
        console.log(`  Target Gmail: ${email}`);
        console.log(`  Recovery Code: [ ${code} ]`);
        console.log(`  Expiration: 10 minutes`);
        console.log(`======================================================\n`);
        return code;
    }
    // Verify Recovery Code
    verifyRecovery(email, code) {
        const emailKey = email.toLowerCase();
        const entry = this.recoveryCodes.get(emailKey);
        if (!entry)
            return false;
        if (Date.now() > entry.expiresAt) {
            this.recoveryCodes.delete(emailKey);
            return false;
        }
        if (entry.code === code) {
            this.recoveryCodes.delete(emailKey);
            return true;
        }
        return false;
    }
    // Save brand new account details after verification and username selection
    createAccount(identifier, passwordHash, username) {
        if (this.isUsernameTaken(username)) {
            throw new Error('Username already taken.');
        }
        const users = this.loadUsers();
        // Safety check in case they are already registered
        const exists = users.some(u => u.identifier.toLowerCase() === identifier.toLowerCase());
        if (exists) {
            throw new Error('An account already exists with this email/mobile.');
        }
        const newUser = {
            identifier,
            username,
            passwordHash,
            verified: true,
            membership: 'free',
            tokens_remaining: 10,
            chat_queries_remaining: 5,
            created_at: new Date().toISOString()
        };
        users.push(newUser);
        this.saveUsers(users);
        return newUser;
    }
    // Deduct token count
    deductToken(identifier) {
        const user = this.findUser(identifier);
        if (!user)
            return;
        if (user.membership === 'advanced' || user.membership === 'elite') {
            return;
        }
        const users = this.loadUsers();
        const idx = users.findIndex(u => u.identifier.toLowerCase() === user.identifier.toLowerCase());
        if (idx !== -1) {
            if (users[idx].tokens_remaining > 0) {
                users[idx].tokens_remaining -= 1;
                this.saveUsers(users);
            }
        }
    }
    // Deduct Chat queries count for free plans
    deductChatQuery(identifier) {
        const user = this.findUser(identifier);
        if (!user || user.membership !== 'free')
            return;
        const users = this.loadUsers();
        const idx = users.findIndex(u => u.identifier.toLowerCase() === user.identifier.toLowerCase());
        if (idx !== -1) {
            const remaining = users[idx].chat_queries_remaining ?? 5;
            if (remaining > 0) {
                users[idx].chat_queries_remaining = remaining - 1;
                this.saveUsers(users);
            }
        }
    }
    // Upgrade Membership Plan Tier
    upgradeMembership(identifier, tier) {
        const users = this.loadUsers();
        const idx = users.findIndex(u => u.identifier.toLowerCase() === identifier.toLowerCase());
        if (idx === -1) {
            throw new Error('User account not found.');
        }
        let tokens = 10;
        if (tier === 'basic')
            tokens = 50;
        if (tier === 'advanced' || tier === 'elite')
            tokens = 99999;
        users[idx].membership = tier;
        users[idx].tokens_remaining = tokens;
        users[idx].chat_queries_remaining = 99999; // Unlimited for all membership plans
        this.saveUsers(users);
        return users[idx];
    }
    // Register temporary OTP code
    initiateSignup(identifier, secret) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const passwordHash = this.hashPassword(secret);
        this.pendingSignups.set(identifier.toLowerCase(), {
            identifier,
            passwordHash,
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000
        });
        console.log(`\n======================================================`);
        console.log(`  [OTP DISPATCHER SERVICE]`);
        console.log(`  Target Receiver: ${identifier}`);
        console.log(`  Verification Passcode: [ ${otp} ]`);
        console.log(`  Expiration: 5 minutes`);
        console.log(`======================================================\n`);
        return otp;
    }
    // Validate OTP during registration and retrieve cached signup payload details
    verifyOtpAndGetPending(identifier, code) {
        const idKey = identifier.toLowerCase();
        const pending = this.pendingSignups.get(idKey);
        if (!pending) {
            throw new Error('No pending registration found for this email or mobile number.');
        }
        if (Date.now() > pending.expiresAt) {
            this.pendingSignups.delete(idKey);
            throw new Error('Verification code has expired. Please sign up again.');
        }
        if (pending.otp !== code) {
            throw new Error('Incorrect 6-digit verification code. Please check your console.');
        }
        // Remove from pending map cache
        this.pendingSignups.delete(idKey);
        return pending;
    }
}
exports.UserService = UserService;
