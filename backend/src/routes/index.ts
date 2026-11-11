import express from "express";
import UserController from "../controllers/user.controller";
import DashboardController from "../controllers/dashboard.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

// Auth routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile", authenticateToken, UserController.getProfile);

// Dashboard routes
router.get("/dashboard/summary", authenticateToken, DashboardController.getSummary);
router.get("/dashboard/low-stock", authenticateToken, DashboardController.getLowStockStats);

// Product routes
router.get("/products", authenticateToken, UserController.list);
router.post("/products", authenticateToken, UserController.create);
router.get("/products/:id", authenticateToken, UserController.getById);
router.put("/products/:id", authenticateToken, UserController.update);
router.delete("/products/:id", authenticateToken, UserController.remove);

// Auth routes (public)
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 404 handler
router.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
router.use((err: any, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

export default router;