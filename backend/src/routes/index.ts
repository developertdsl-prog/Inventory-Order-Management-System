import express from "express";
import UserController from "../controllers/user.controller";
import ProductController from "../controllers/product.controller";
import CategoryController from "../controllers/category.controller";
import DashboardController from "../controllers/dashboard.controller";
import InventoryController from "../controllers/inventory.controller";
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
router.get("/products", authenticateToken, ProductController.list);
router.post("/products", authenticateToken, ProductController.create);
router.get("/products/:id", authenticateToken, ProductController.getById);
router.put("/products/:id", authenticateToken, ProductController.update);
router.delete("/products/:id", authenticateToken, ProductController.remove);

// Category routes
router.get("/categories", authenticateToken, CategoryController.list);
router.post("/categories", authenticateToken, CategoryController.create);
router.get("/categories/:id", authenticateToken, CategoryController.getById);
router.put("/categories/:id", authenticateToken, CategoryController.update);
router.delete("/categories/:id", authenticateToken, CategoryController.remove);

// Inventory routes
router.post("/inventory/stock-in", authenticateToken, InventoryController.stockIn);
router.post("/inventory/stock-out", authenticateToken, InventoryController.stockOut);
router.post("/inventory/adjust", authenticateToken, InventoryController.stockAdjustment);
router.get("/inventory/movements", authenticateToken, InventoryController.stockMovementHistory);
router.get("/inventory/low-stock", authenticateToken, InventoryController.lowStockAlerts);

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