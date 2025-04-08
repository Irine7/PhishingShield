import { 
  InsertPhishingPattern, 
  PhishingPattern, 
  InsertScan, 
  Scan, 
  User, 
  InsertUser, 
  Finding, 
  AnalysisResult,
  users,
  phishingPatterns,
  scans
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Storage interface with CRUD operations
export interface IStorage {
  // User operations (from original template)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Phishing pattern operations
  addPhishingPattern(pattern: InsertPhishingPattern): Promise<PhishingPattern>;
  getPhishingPatterns(): Promise<PhishingPattern[]>;
  getPhishingPatternsByType(type: string): Promise<PhishingPattern[]>;
  deletePhishingPattern(id: number): Promise<boolean>;

  // Scan operations
  addScan(scan: InsertScan): Promise<Scan>;
  getScans(limit?: number): Promise<Scan[]>;
  getScanById(id: number): Promise<Scan | undefined>;
  deleteScan(id: number): Promise<boolean>;

  // Analysis functionality
  analyzeTransaction(transaction: string): Promise<AnalysisResult>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private phishingPatterns: Map<number, PhishingPattern>;
  private scans: Map<number, Scan>;
  private userId: number;
  private patternId: number;
  private scanId: number;

  constructor() {
    this.users = new Map();
    this.phishingPatterns = new Map();
    this.scans = new Map();
    this.userId = 1;
    this.patternId = 1;
    this.scanId = 1;

    // Initialize with some known phishing patterns
    this.initPhishingPatterns();
  }

  // User operations (from original template)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Phishing pattern operations
  async addPhishingPattern(pattern: InsertPhishingPattern): Promise<PhishingPattern> {
    const id = this.patternId++;
    const newPattern: PhishingPattern = { 
      ...pattern, 
      id, 
      createdAt: new Date() 
    };
    this.phishingPatterns.set(id, newPattern);
    return newPattern;
  }

  async getPhishingPatterns(): Promise<PhishingPattern[]> {
    return Array.from(this.phishingPatterns.values());
  }

  async getPhishingPatternsByType(type: string): Promise<PhishingPattern[]> {
    return Array.from(this.phishingPatterns.values())
      .filter(pattern => pattern.patternType === type);
  }

  async deletePhishingPattern(id: number): Promise<boolean> {
    return this.phishingPatterns.delete(id);
  }

  // Scan operations
  async addScan(scan: InsertScan): Promise<Scan> {
    const id = this.scanId++;
    // Ensure proper null handling for optional fields
    const newScan: Scan = { 
      ...scan, 
      id, 
      createdAt: new Date(),
      url: scan.url || null,
      contractAddress: scan.contractAddress || null
    };
    this.scans.set(id, newScan);
    return newScan;
  }

  async getScans(limit?: number): Promise<Scan[]> {
    const scans = Array.from(this.scans.values())
      .sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.getTime() - a.createdAt.getTime();
        }
        return 0;
      });
    
    if (limit) {
      return scans.slice(0, limit);
    }
    return scans;
  }

  async getScanById(id: number): Promise<Scan | undefined> {
    return this.scans.get(id);
  }

  async deleteScan(id: number): Promise<boolean> {
    return this.scans.delete(id);
  }

  // Transaction analysis
  async analyzeTransaction(transaction: string): Promise<AnalysisResult> {
    const findings: Finding[] = [];
    let riskLevel = 0;
    const advice: string[] = [];
    let url: string | undefined;
    let contractAddress: string | undefined;
    const functionCalls: string[] = [];

    // Special case for testing direct input patterns
    // This ensures even without URL/address parsing, known suspicious patterns are detected
    const allPatterns = await this.getPhishingPatterns();
    for (const pattern of allPatterns) {
      if (transaction.toLowerCase().includes(pattern.pattern.toLowerCase())) {
        findings.push({
          type: pattern.patternType,
          description: pattern.description,
          severity: pattern.riskLevel > 70 ? 'high' : pattern.riskLevel > 40 ? 'medium' : 'low',
          details: `Found suspicious pattern: ${pattern.pattern}`
        });
        riskLevel += pattern.riskLevel;
        
        if (pattern.patternType === 'function') {
          functionCalls.push(pattern.pattern);
        }
        
        // Add appropriate advice based on pattern type
        if (pattern.patternType === 'domain') {
          advice.push('Check the URL carefully. Make sure it matches the official domain exactly.');
        } else if (pattern.patternType === 'contract') {
          advice.push('Verify the contract address on a block explorer like Etherscan.');
        } else if (pattern.patternType === 'function' && pattern.pattern.includes('approve')) {
          advice.push('Check token approval amounts. Consider using a limited approval amount instead of unlimited.');
        }
      }
    }

    // Extract URL if present
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urlMatches = transaction.match(urlRegex);
    if (urlMatches && urlMatches.length > 0) {
      url = urlMatches[0];
      
      // Only run domain-specific checks if not already caught above
      if (!findings.some(f => f.type === 'domain')) {
        const domainPatterns = await this.getPhishingPatternsByType('domain');
        for (const pattern of domainPatterns) {
          if (url.toLowerCase().includes(pattern.pattern.toLowerCase())) {
            findings.push({
              type: 'domain',
              description: pattern.description,
              severity: 'high',
              details: `Found suspicious domain: ${pattern.pattern}`
            });
            riskLevel += pattern.riskLevel;
            advice.push('Check the URL carefully. Make sure it matches the official domain exactly.');
          }
        }
      }
    }

    // Extract contract address if present (simple regex, in real app would be more robust)
    const addressRegex = /(0x[a-fA-F0-9]{40})/g;
    const addressMatches = transaction.match(addressRegex);
    if (addressMatches && addressMatches.length > 0) {
      contractAddress = addressMatches[0];
      
      // Only run contract-specific checks if not already caught above
      if (!findings.some(f => f.type === 'contract')) {
        const contractPatterns = await this.getPhishingPatternsByType('contract');
        for (const pattern of contractPatterns) {
          if (contractAddress.toLowerCase() === pattern.pattern.toLowerCase()) {
            findings.push({
              type: 'contract',
              description: pattern.description,
              severity: 'high',
              details: `Found blacklisted contract: ${pattern.pattern}`
            });
            riskLevel += pattern.riskLevel;
            advice.push('Verify the contract address on a block explorer like Etherscan.');
          }
        }
      }
    }

    // Check for suspicious function calls (if not already detected above)
    if (!findings.some(f => f.type === 'function')) {
      const functionPatterns = await this.getPhishingPatternsByType('function');
      for (const pattern of functionPatterns) {
        if (transaction.toLowerCase().includes(pattern.pattern.toLowerCase())) {
          findings.push({
            type: 'function',
            description: pattern.description,
            severity: pattern.riskLevel > 70 ? 'high' : pattern.riskLevel > 40 ? 'medium' : 'low',
            details: `Found suspicious function call: ${pattern.pattern}`
          });
          
          functionCalls.push(pattern.pattern);
          riskLevel += pattern.riskLevel;
          
          if (pattern.pattern.includes('approve')) {
            advice.push('Check token approval amounts. Consider using a limited approval amount instead of unlimited.');
          }
        }
      }
    }

    // If no specific risks found but transaction is complex, add a general warning
    if (findings.length === 0 && transaction.length > 100) {
      findings.push({
        type: 'general',
        description: 'Complex transaction',
        severity: 'low',
        details: 'This is a complex transaction. Review carefully before signing.'
      });
      riskLevel += 20;
      advice.push('Review all parameters carefully before signing any complex transaction.');
    }

    // Cap risk level at 100
    riskLevel = Math.min(riskLevel, 100);
    
    // Add general advice based on risk level
    if (riskLevel > 70) {
      advice.push('Consider rejecting this transaction as it shows high-risk patterns.');
    } else if (riskLevel > 40) {
      advice.push('Proceed with caution and verify all transaction details.');
    } else {
      advice.push('Always verify transaction details before signing, even for low-risk transactions.');
    }

    return {
      riskLevel,
      findings,
      url,
      contractAddress,
      functionCalls,
      advice: Array.from(new Set(advice)) // Remove duplicates
    };
  }

  // Initialize with some known phishing patterns
  private initPhishingPatterns() {
    const initialPatterns: InsertPhishingPattern[] = [
      {
        pattern: 'pancakesswap.finance',
        patternType: 'domain',
        description: 'Fake PancakeSwap domain (correct is pancakeswap.finance)',
        riskLevel: 90
      },
      {
        pattern: 'uniswapp.org',
        patternType: 'domain',
        description: 'Fake Uniswap domain (correct is uniswap.org)',
        riskLevel: 90
      },
      {
        pattern: 'metamaask.io',
        patternType: 'domain',
        description: 'Fake MetaMask domain (correct is metamask.io)',
        riskLevel: 90
      },
      {
        pattern: 'sushiswapv3.com',
        patternType: 'domain',
        description: 'Fake SushiSwap domain',
        riskLevel: 90
      },
      {
        pattern: 'wallet-connect.cc',
        patternType: 'domain',
        description: 'Fake WalletConnect domain',
        riskLevel: 90
      },
      {
        pattern: 'approve(0xffffffffffffffffffffffffffffffffffffffff',
        patternType: 'function',
        description: 'Unlimited token approval requested',
        riskLevel: 85
      },
      {
        pattern: 'transferFrom(',
        patternType: 'function',
        description: 'Token transfer from your wallet to another address',
        riskLevel: 60
      },
      {
        pattern: 'setApprovalForAll(',
        patternType: 'function',
        description: 'Full collection approval for NFTs',
        riskLevel: 80
      },
      {
        pattern: '0x25f666Aa45A1E9452F923A6AB547750BBe138B75',
        patternType: 'contract',
        description: 'Known malicious contract',
        riskLevel: 95
      }
    ];

    for (const pattern of initialPatterns) {
      this.addPhishingPattern(pattern);
    }
  }
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with some known phishing patterns
    this.initPhishingPatterns();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Phishing pattern operations
  async addPhishingPattern(pattern: InsertPhishingPattern): Promise<PhishingPattern> {
    const [newPattern] = await db.insert(phishingPatterns).values(pattern).returning();
    return newPattern;
  }

  async getPhishingPatterns(): Promise<PhishingPattern[]> {
    return db.select().from(phishingPatterns);
  }

  async getPhishingPatternsByType(type: string): Promise<PhishingPattern[]> {
    return db.select().from(phishingPatterns).where(eq(phishingPatterns.patternType, type));
  }

  async deletePhishingPattern(id: number): Promise<boolean> {
    const result = await db.delete(phishingPatterns).where(eq(phishingPatterns.id, id)).returning();
    return result.length > 0;
  }

  // Scan operations
  async addScan(scan: InsertScan): Promise<Scan> {
    // Ensure we have the correct required properties from the schema
    const scanToInsert = {
      ...scan,
      url: scan.url || null,
      contractAddress: scan.contractAddress || null
    };
    
    const [newScan] = await db.insert(scans).values(scanToInsert).returning();
    return newScan;
  }

  async getScans(limit?: number): Promise<Scan[]> {
    if (limit) {
      return db.select().from(scans).orderBy(desc(scans.createdAt)).limit(limit);
    }
    
    return db.select().from(scans).orderBy(desc(scans.createdAt));
  }

  async getScanById(id: number): Promise<Scan | undefined> {
    const [scan] = await db.select().from(scans).where(eq(scans.id, id));
    return scan;
  }

  async deleteScan(id: number): Promise<boolean> {
    const result = await db.delete(scans).where(eq(scans.id, id)).returning();
    return result.length > 0;
  }

  // Transaction analysis
  async analyzeTransaction(transaction: string): Promise<AnalysisResult> {
    const findings: Finding[] = [];
    let riskLevel = 0;
    const advice: string[] = [];
    let url: string | undefined;
    let contractAddress: string | undefined;
    const functionCalls: string[] = [];

    // Special case for testing direct input patterns
    // This ensures even without URL/address parsing, known suspicious patterns are detected
    const allPatterns = await this.getPhishingPatterns();
    for (const pattern of allPatterns) {
      if (transaction.toLowerCase().includes(pattern.pattern.toLowerCase())) {
        findings.push({
          type: pattern.patternType,
          description: pattern.description,
          severity: pattern.riskLevel > 70 ? 'high' : pattern.riskLevel > 40 ? 'medium' : 'low',
          details: `Found suspicious pattern: ${pattern.pattern}`
        });
        riskLevel += pattern.riskLevel;
        
        if (pattern.patternType === 'function') {
          functionCalls.push(pattern.pattern);
        }
        
        // Add appropriate advice based on pattern type
        if (pattern.patternType === 'domain') {
          advice.push('Check the URL carefully. Make sure it matches the official domain exactly.');
        } else if (pattern.patternType === 'contract') {
          advice.push('Verify the contract address on a block explorer like Etherscan.');
        } else if (pattern.patternType === 'function' && pattern.pattern.includes('approve')) {
          advice.push('Check token approval amounts. Consider using a limited approval amount instead of unlimited.');
        }
      }
    }

    // Extract URL if present
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urlMatches = transaction.match(urlRegex);
    if (urlMatches && urlMatches.length > 0) {
      url = urlMatches[0];
      
      // Only run domain-specific checks if not already caught above
      if (!findings.some(f => f.type === 'domain')) {
        const domainPatterns = await this.getPhishingPatternsByType('domain');
        for (const pattern of domainPatterns) {
          if (url.toLowerCase().includes(pattern.pattern.toLowerCase())) {
            findings.push({
              type: 'domain',
              description: pattern.description,
              severity: 'high',
              details: `Found suspicious domain: ${pattern.pattern}`
            });
            riskLevel += pattern.riskLevel;
            advice.push('Check the URL carefully. Make sure it matches the official domain exactly.');
          }
        }
      }
    }

    // Extract contract address if present (simple regex, in real app would be more robust)
    const addressRegex = /(0x[a-fA-F0-9]{40})/g;
    const addressMatches = transaction.match(addressRegex);
    if (addressMatches && addressMatches.length > 0) {
      contractAddress = addressMatches[0];
      
      // Only run contract-specific checks if not already caught above
      if (!findings.some(f => f.type === 'contract')) {
        const contractPatterns = await this.getPhishingPatternsByType('contract');
        for (const pattern of contractPatterns) {
          if (contractAddress.toLowerCase() === pattern.pattern.toLowerCase()) {
            findings.push({
              type: 'contract',
              description: pattern.description,
              severity: 'high',
              details: `Found blacklisted contract: ${pattern.pattern}`
            });
            riskLevel += pattern.riskLevel;
            advice.push('Verify the contract address on a block explorer like Etherscan.');
          }
        }
      }
    }

    // Check for suspicious function calls (if not already detected above)
    if (!findings.some(f => f.type === 'function')) {
      const functionPatterns = await this.getPhishingPatternsByType('function');
      for (const pattern of functionPatterns) {
        if (transaction.toLowerCase().includes(pattern.pattern.toLowerCase())) {
          findings.push({
            type: 'function',
            description: pattern.description,
            severity: pattern.riskLevel > 70 ? 'high' : pattern.riskLevel > 40 ? 'medium' : 'low',
            details: `Found suspicious function call: ${pattern.pattern}`
          });
          
          functionCalls.push(pattern.pattern);
          riskLevel += pattern.riskLevel;
          
          if (pattern.pattern.includes('approve')) {
            advice.push('Check token approval amounts. Consider using a limited approval amount instead of unlimited.');
          }
        }
      }
    }

    // If no specific risks found but transaction is complex, add a general warning
    if (findings.length === 0 && transaction.length > 100) {
      findings.push({
        type: 'general',
        description: 'Complex transaction',
        severity: 'low',
        details: 'This is a complex transaction. Review carefully before signing.'
      });
      riskLevel += 20;
      advice.push('Review all parameters carefully before signing any complex transaction.');
    }

    // Cap risk level at 100
    riskLevel = Math.min(riskLevel, 100);
    
    // Add general advice based on risk level
    if (riskLevel > 70) {
      advice.push('Consider rejecting this transaction as it shows high-risk patterns.');
    } else if (riskLevel > 40) {
      advice.push('Proceed with caution and verify all transaction details.');
    } else {
      advice.push('Always verify transaction details before signing, even for low-risk transactions.');
    }

    return {
      riskLevel,
      findings,
      url,
      contractAddress,
      functionCalls,
      advice: Array.from(new Set(advice)) // Remove duplicates
    };
  }

  // Initialize with some known phishing patterns
  private async initPhishingPatterns() {
    // First check if we already have patterns in the database
    const existingPatterns = await this.getPhishingPatterns();
    if (existingPatterns.length > 0) {
      return; // Database already has patterns, no need to initialize
    }

    const initialPatterns: InsertPhishingPattern[] = [
      {
        pattern: 'pancakesswap.finance',
        patternType: 'domain',
        description: 'Fake PancakeSwap domain (correct is pancakeswap.finance)',
        riskLevel: 90
      },
      {
        pattern: 'uniswapp.org',
        patternType: 'domain',
        description: 'Fake Uniswap domain (correct is uniswap.org)',
        riskLevel: 90
      },
      {
        pattern: 'metamaask.io',
        patternType: 'domain',
        description: 'Fake MetaMask domain (correct is metamask.io)',
        riskLevel: 90
      },
      {
        pattern: 'sushiswapv3.com',
        patternType: 'domain',
        description: 'Fake SushiSwap domain',
        riskLevel: 90
      },
      {
        pattern: 'wallet-connect.cc',
        patternType: 'domain',
        description: 'Fake WalletConnect domain',
        riskLevel: 90
      },
      {
        pattern: 'approve(0xffffffffffffffffffffffffffffffffffffffff',
        patternType: 'function',
        description: 'Unlimited token approval requested',
        riskLevel: 85
      },
      {
        pattern: 'transferFrom(',
        patternType: 'function',
        description: 'Token transfer from your wallet to another address',
        riskLevel: 60
      },
      {
        pattern: 'setApprovalForAll(',
        patternType: 'function',
        description: 'Full collection approval for NFTs',
        riskLevel: 80
      },
      {
        pattern: '0x25f666Aa45A1E9452F923A6AB547750BBe138B75',
        patternType: 'contract',
        description: 'Known malicious contract',
        riskLevel: 95
      }
    ];

    for (const pattern of initialPatterns) {
      await this.addPhishingPattern(pattern);
    }
  }
}

// Switch from MemStorage to DatabaseStorage
export const storage = new DatabaseStorage();
