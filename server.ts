import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { registrationSchema } from "./src/shared/validation";
import {
  saveRegistration,
  getRegistrations,
  deleteRegistration,
  getDbStatus,
  connectToDatabase,
} from "./src/server_db";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON bodies
  app.use(express.json());

  // Connect to Database immediately upon server boot (lazy fallback if fails)
  connectToDatabase().catch((err) => {
    console.error("Initial database connection failed, operating in sandbox mode:", err);
  });

  // ==================== API ENDPOINTS ====================

  // 1. Health & Database Status
  app.get("/api/db-status", (req, res) => {
    try {
      const status = getDbStatus();
      res.json({
        status: "ok",
        ...status,
      });
    } catch (err: any) {
      res.status(500).json({
        error: "Failed to retrieve database status",
        details: err?.message || err,
      });
    }
  });

  // 2. Submit New Registration (With Zod Validation & Database Persistence)
  app.post("/api/register", async (req, res) => {
    try {
      const body = req.body;
      console.log("[API /api/register] Received onboarding data for:", body.companyName);

      // Perform validation using Zod schema
      const validationResult = registrationSchema.safeParse(body);
      if (!validationResult.success) {
        console.warn("[API /api/register] Validation failed:", validationResult.error.flatten());
        return res.status(400).json({
          error: "Validation failed",
          errors: validationResult.error.flatten().fieldErrors,
        });
      }

      // Save valid data to the persistent layer
      const result = await saveRegistration(validationResult.data);
      console.log(`[API /api/register] Saved successfully to [${result.dbType}]`);

      return res.status(201).json({
        message: "Registration successful",
        dbType: result.dbType,
        data: result.data,
      });
    } catch (err: any) {
      console.error("[API /api/register] Critical failure during registration:", err);
      return res.status(500).json({
        error: "Internal server error saving registration",
        details: err?.message || "Please verify database configuration.",
      });
    }
  });

  // 3. Get All Onboarding Records (For On-screen Admin List view)
  app.get("/api/registrations", async (req, res) => {
    try {
      const list = await getRegistrations();
      res.json({
        success: true,
        count: list.length,
        data: list,
      });
    } catch (err: any) {
      console.error("[API /api/registrations] Fetch failure:", err);
      res.status(500).json({
        error: "Failed to retrieve registration database records",
        details: err?.message || err,
      });
    }
  });

  // 4. Delete A Onboarding Record
  app.delete("/api/registrations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await deleteRegistration(id);
      if (result.success) {
        res.json({ success: true, message: "Record deleted successfully" });
      } else {
        res.status(404).json({ error: "Record not found or already deleted" });
      }
    } catch (err: any) {
      console.error("[API /api/registrations/:id] Delete failure:", err);
      res.status(500).json({
        error: "Failed to delete record",
        details: err?.message || err,
      });
    }
  });

  // ==================== VITE CLIENT INTEGRATION ====================

  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Listen on all network interfaces
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Sigma Server] Running successfully at http://localhost:${PORT}`);
    console.log(`[Sigma Server] Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

startServer().catch((err) => {
  console.error("[Sigma Server] Failed to boot full-stack server:", err);
});
