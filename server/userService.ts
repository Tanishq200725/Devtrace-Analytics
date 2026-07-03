import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(__dirname, '../users.json');

export interface User {
  identifier: string; // Email or Mobile Number
  username?: string; // Unique chosen username
  passwordHash: string; // Base64 encoded password
  verified: boolean;
  membership: 'free' | 'basic' | 'advanced' | 'elite';
  tokens_remaining: number;
  chat_queries_remaining?: number; // AI assistant chat credits
  created_at: string;
}

export interface PendingSignup {
  identifier: string;
  otp: string;
  expiresAt: number;
}

export class UserService {
  private pendingSignups = new Map<string, PendingSignup>();
  // Memory cache for recovery codes (forgot password flow)
  private recoveryCodes = new Map<string, { code: string; expiresAt: number }>();

  constructor() {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([]));
    }
  }

  private loadUsers(): User[] {
    try {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data) as User[];
    } catch (err) {
      return [];
    }
  }

  private saveUsers(users: User[]): void {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  }

  private hashPassword(password: string): string {
    return Buffer.from(password).toString('base64');
  }

  // Find user details by identifier (Email or Mobile)
  public findUser(identifier: string): User | undefined {
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
      } else {
        let changed = false;
        if (user.membership !== 'elite') { user.membership = 'elite'; changed = true; }
        if (!user.username) { user.username = 'Tanishq'; changed = true; }
        if (user.chat_queries_remaining !== 99999) { user.chat_queries_remaining = 99999; changed = true; }
        if (changed) this.saveUsers(users);
      }
    } else if (user) {
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
  public findUserByUsername(username: string): User | undefined {
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
  public findUserByEmail(email: string): User | undefined {
    const users = this.loadUsers();
    const matched = users.find(u => u.identifier.toLowerCase() === email.toLowerCase());
    
    if (matched && typeof matched.chat_queries_remaining === 'undefined') {
      return this.findUser(matched.identifier);
    }
    return matched;
  }

  // Verify login credentials using username
  public verifyCredentialsByUsername(username: string, secret: string): boolean {
    const isOwner = username.toLowerCase() === 'tanishq';
    if (isOwner && secret === 'Shiv@0205') {
      this.findUser('tanishq@gmail.com'); // ensure created
      return true;
    }

    const user = this.findUserByUsername(username);
    if (!user) return false;
    return user.passwordHash === this.hashPassword(secret);
  }

  // Check if a username is already registered (case-insensitive)
  public isUsernameTaken(username: string): boolean {
    if (username.toLowerCase() === 'tanishq') return true; // reserved for owner
    const users = this.loadUsers();
    return users.some(u => u.username && u.username.toLowerCase() === username.toLowerCase());
  }

  // Generate 3 unique username suggestions that are verified to be free
  public generateUsernameSuggestions(username: string): string[] {
    const base = username.trim().replace(/[^a-zA-Z0-9]/g, '');
    const suggestions: string[] = [];
    
    const formats = [
      (b: string) => `${b}_dev`,
      (b: string) => `${b}${Math.floor(100 + Math.random() * 900)}`,
      (b: string) => `${b}_trace`,
      (b: string) => `${b}_core`,
      (b: string) => `dev_${b}`,
      (b: string) => `archaeo_${b}`
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
  public initiateRecovery(email: string): string {
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
  public verifyRecovery(email: string, code: string): boolean {
    const emailKey = email.toLowerCase();
    const entry = this.recoveryCodes.get(emailKey);

    if (!entry) return false;
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
  public createAccount(identifier: string, secret: string, username: string): User {
    if (this.isUsernameTaken(username)) {
      throw new Error('Username already taken.');
    }

    const users = this.loadUsers();
    
    // Safety check in case they are already registered
    const exists = users.some(u => u.identifier.toLowerCase() === identifier.toLowerCase());
    if (exists) {
      throw new Error('An account already exists with this email/mobile.');
    }

    const newUser: User = {
      identifier,
      username,
      passwordHash: this.hashPassword(secret),
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
  public deductToken(identifier: string): void {
    const user = this.findUser(identifier);
    if (!user) return;

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
  public deductChatQuery(identifier: string): void {
    const user = this.findUser(identifier);
    if (!user || user.membership !== 'free') return;

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
  public upgradeMembership(identifier: string, tier: 'basic' | 'advanced' | 'elite'): User {
    const users = this.loadUsers();
    const idx = users.findIndex(u => u.identifier.toLowerCase() === identifier.toLowerCase());

    if (idx === -1) {
      throw new Error('User account not found.');
    }

    let tokens = 10;
    if (tier === 'basic') tokens = 50;
    if (tier === 'advanced' || tier === 'elite') tokens = 99999;

    users[idx].membership = tier;
    users[idx].tokens_remaining = tokens;
    users[idx].chat_queries_remaining = 99999; // Unlimited for all membership plans
    
    this.saveUsers(users);
    return users[idx];
  }

  // Register temporary OTP code
  public initiateSignup(identifier: string): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    this.pendingSignups.set(identifier.toLowerCase(), {
      identifier,
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
  public verifyOtpAndGetPending(identifier: string, code: string): PendingSignup {
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
