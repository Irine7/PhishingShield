import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scanSchema, insertPhishingPatternSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for transaction analysis
  app.post("/api/analyze", async (req: Request, res: Response) => {
    try {
      const { transaction } = req.body;
      
      if (!transaction) {
        return res.status(400).json({ 
          message: "Transaction data is required" 
        });
      }

      console.log("Analyzing transaction:", transaction);
      const result = await storage.analyzeTransaction(transaction);
      console.log("Analysis result:", result);
      
      // Add the scan to history
      await storage.addScan({
        transactionData: transaction,
        url: result.url,
        contractAddress: result.contractAddress,
        riskLevel: result.riskLevel,
        findings: JSON.stringify(result.findings)
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error analyzing transaction:", error);
      return res.status(500).json({ 
        message: "Failed to analyze transaction" 
      });
    }
  });

  // Get all phishing patterns
  app.get("/api/phishing-patterns", async (_req: Request, res: Response) => {
    try {
      const patterns = await storage.getPhishingPatterns();
      return res.status(200).json(patterns);
    } catch (error) {
      console.error("Error fetching phishing patterns:", error);
      return res.status(500).json({ 
        message: "Failed to fetch phishing patterns" 
      });
    }
  });

  // Get phishing patterns by type
  app.get("/api/phishing-patterns/:type", async (req: Request, res: Response) => {
    try {
      const { type } = req.params;
      const patterns = await storage.getPhishingPatternsByType(type);
      return res.status(200).json(patterns);
    } catch (error) {
      console.error(`Error fetching phishing patterns of type ${req.params.type}:`, error);
      return res.status(500).json({ 
        message: "Failed to fetch phishing patterns" 
      });
    }
  });

  // Add new phishing pattern
  app.post("/api/phishing-patterns", async (req: Request, res: Response) => {
    try {
      const patternData = insertPhishingPatternSchema.parse(req.body);
      const newPattern = await storage.addPhishingPattern(patternData);
      return res.status(201).json(newPattern);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: fromZodError(error).message 
        });
      }
      console.error("Error adding phishing pattern:", error);
      return res.status(500).json({ 
        message: "Failed to add phishing pattern" 
      });
    }
  });

  // Delete a phishing pattern
  app.delete("/api/phishing-patterns/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          message: "Invalid ID format" 
        });
      }
      
      const success = await storage.deletePhishingPattern(id);
      if (!success) {
        return res.status(404).json({ 
          message: "Phishing pattern not found" 
        });
      }
      
      return res.status(200).json({ 
        message: "Phishing pattern deleted successfully" 
      });
    } catch (error) {
      console.error(`Error deleting phishing pattern ${req.params.id}:`, error);
      return res.status(500).json({ 
        message: "Failed to delete phishing pattern" 
      });
    }
  });

  // Get scan history
  app.get("/api/scans", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const scans = await storage.getScans(limit);
      return res.status(200).json(scans);
    } catch (error) {
      console.error("Error fetching scan history:", error);
      return res.status(500).json({ 
        message: "Failed to fetch scan history" 
      });
    }
  });

  // Get specific scan by ID
  app.get("/api/scans/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          message: "Invalid ID format" 
        });
      }
      
      const scan = await storage.getScanById(id);
      if (!scan) {
        return res.status(404).json({ 
          message: "Scan not found" 
        });
      }
      
      return res.status(200).json(scan);
    } catch (error) {
      console.error(`Error fetching scan ${req.params.id}:`, error);
      return res.status(500).json({ 
        message: "Failed to fetch scan" 
      });
    }
  });

  // Delete a scan
  app.delete("/api/scans/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ 
          message: "Invalid ID format" 
        });
      }
      
      const success = await storage.deleteScan(id);
      if (!success) {
        return res.status(404).json({ 
          message: "Scan not found" 
        });
      }
      
      return res.status(200).json({ 
        message: "Scan deleted successfully" 
      });
    } catch (error) {
      console.error(`Error deleting scan ${req.params.id}:`, error);
      return res.status(500).json({ 
        message: "Failed to delete scan" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
