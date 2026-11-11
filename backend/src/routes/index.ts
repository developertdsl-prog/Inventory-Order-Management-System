import express from "express";
import UserController from "../controllers/user.controller";
import ProductController from "../controllers/product.controller";
import CategoryController from "../controllers/category.controller";
import SupplierController from "../controllers/supplier.controller";
import PurchaseOrderController from "../controllers/purchase-order.controller";
import InventoryTransactionController from "../controllers/inventory-transaction.controller";

const router = express.Router();

// User routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile", UserController.getProfile);

// Product routes
router.get("/products", ProductController.list);
router.post("/products", ProductController.create);
router.get("/products/:id", ProductController.getById);
router.put("/products/:id", ProductController.update);
router.delete("/products/:id", ProductController.remove);

// Category routes
router.get("/categories", CategoryController.list);
router.post("/categories", CategoryController.create);
router.get("/categories/:id", CategoryController.getById);
router.put("/categories/:id", CategoryController.update);
router.delete("/categories/:id", CategoryController.remove);

// Supplier routes
router.get("/suppliers", SupplierController.list);
router.post("/suppliers", SupplierController.create);
router.get("/suppliers/:id", SupplierController.getById);
router.put("/suppliers/:id", SupplierController.update);
router.delete("/suppliers/:id", SupplierController.remove);

// Purchase Order routes
router.post("/purchase-orders", PurchaseOrderController.create);
router.get("/purchase-orders", PurchaseOrderController.list);
router.put("/purchase-orders/:id/status", PurchaseOrderController.updateStatus);

// Inventory Transaction routes
router.post("/inventory-transactions", InventoryTransactionController.create);
router.get("/inventory-transactions", InventoryTransactionController.list);

export default router;