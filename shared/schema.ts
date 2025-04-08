import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (keeping the original table for authentication if needed)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Phishing Patterns table to store known phishing patterns
export const phishingPatterns = pgTable("phishing_patterns", {
  id: serial("id").primaryKey(),
  pattern: text("pattern").notNull(),
  patternType: text("pattern_type").notNull(), // domain, contract, function, url
  description: text("description").notNull(),
  riskLevel: integer("risk_level").notNull(), // 0-100
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPhishingPatternSchema = createInsertSchema(phishingPatterns).pick({
  pattern: true,
  patternType: true,
  description: true,
  riskLevel: true,
});

// Transaction Scans table to store scan history
export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  transactionData: text("transaction_data").notNull(),
  url: text("url"),
  contractAddress: text("contract_address"),
  riskLevel: integer("risk_level").notNull(), // 0-100
  findings: text("findings").notNull(), // JSON string of findings
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScanSchema = createInsertSchema(scans).pick({
  transactionData: true,
  url: true,
  contractAddress: true,
  riskLevel: true,
  findings: true,
});

// Phishing patterns schema with validation
export const phishingPatternSchema = z.object({
  pattern: z.string().min(2).max(255),
  patternType: z.enum(["domain", "contract", "function", "url"]),
  description: z.string().min(5),
  riskLevel: z.number().int().min(0).max(100),
});

// Transaction scan schema with validation
export const scanSchema = z.object({
  transactionData: z.string().min(1),
  url: z.string().optional(),
  contractAddress: z.string().optional(),
  riskLevel: z.number().int().min(0).max(100),
  findings: z.string().min(1), // JSON string of findings
});

// Types for TS
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPhishingPattern = z.infer<typeof insertPhishingPatternSchema>;
export type PhishingPattern = typeof phishingPatterns.$inferSelect;

export type InsertScan = z.infer<typeof insertScanSchema>;
export type Scan = typeof scans.$inferSelect;

// Types for transaction analysis
export type Finding = {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  details?: string;
};

export type AnalysisResult = {
  riskLevel: number;
  findings: Finding[];
  url?: string;
  contractAddress?: string;
  functionCalls?: string[];
  advice: string[];
};
