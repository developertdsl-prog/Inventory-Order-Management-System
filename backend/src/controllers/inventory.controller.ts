import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class InventoryController {
  static async stockIn(req: any, res: any) {
    try {
      const { productId, quantity, referenceId, referenceType } = req.body;

      if (!productId || !quantity) {
        return res.status(400).json({ error: "Product ID and quantity are required" });
      }

      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Use transaction to update stock and create inventory record
      const result = await prisma.$transaction([
        prisma.product.update({
          where: { id: productId },
          data: { stock: { increment: parseInt(quantity) } },
        }),
        prisma.inventoryTransaction.create({
          data: {
            productId,
            type: "STOCK_IN",
            quantity: parseInt(quantity),
            referenceId: referenceId || "",
            referenceType: referenceType || "Manual",
          },
          include: { product: { select: { id: true, name: true, sku: true } } },
        }),
      ]);

      const transaction = result[1];
      res.status(201).json({
        message: "Stock increased successfully",
        product: result[0],
        transaction,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async stockOut(req: any, res: any) {
    try {
      const { productId, quantity, referenceId, referenceType } = req.body;

      if (!productId || !quantity) {
        return res.status(400).json({ error: "Product ID and quantity are required" });
      }

      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (product.stock < parseInt(quantity)) {
        return res.status(400).json({
          error: "Insufficient stock",
          currentStock: product.stock,
          requested: parseInt(quantity),
        });
      }

      // Use transaction to update stock and create inventory record
      const result = await prisma.$transaction([
        prisma.product.update({
          where: { id: productId },
          data: { stock: { decrement: parseInt(quantity) } },
        }),
        prisma.inventoryTransaction.create({
          data: {
            productId,
            type: "STOCK_OUT",
            quantity: parseInt(quantity),
            referenceId: referenceId || "",
            referenceType: referenceType || "Manual",
          },
          include: { product: { select: { id: true, name: true, sku: true } } },
        }),
      ]);

      const transaction = result[1];
      res.status(201).json({
        message: "Stock decreased successfully",
        product: result[0],
        transaction,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async stockAdjustment(req: any, res: any) {
    try {
      const { productId, newStock, referenceId, referenceType } = req.body;

      if (!productId || newStock === undefined) {
        return res.status(400).json({ error: "Product ID and new stock value are required" });
      }

      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (parseInt(newStock) < 0) {
        return res.status(400).json({ error: "Stock cannot be negative" });
      }

      const difference = parseInt(newStock) - product.stock;

      // Use transaction to update stock and create inventory record
      const result = await prisma.$transaction([
        prisma.product.update({
          where: { id: productId },
          data: { stock: parseInt(newStock) },
        }),
        prisma.inventoryTransaction.create({
          data: {
            productId,
            type: difference > 0 ? "STOCK_IN" : "STOCK_OUT",
            quantity: Math.abs(difference),
            referenceId: referenceId || "",
            referenceType: referenceType || "Adjustment",
          },
          include: { product: { select: { id: true, name: true, sku: true } } },
        }),
      ]);

      const transaction = result[1];
      res.status(201).json({
        message: "Stock adjusted successfully",
        product: result[0],
        transaction,
        previousStock: product.stock,
        newStock: parseInt(newStock),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async stockMovementHistory(req: any, res: any) {
    try {
      const { page = 1, limit = 20, productId, type } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (productId) where.productId = String(productId);
      if (type) where.type = String(type);

      const [transactions, total] = await Promise.all([
        prisma.inventoryTransaction.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            product: { select: { id: true, name: true, sku: true } },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.inventoryTransaction.count({ where }),
      ]);

      res.json({
        transactions,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async lowStockAlerts(req: any, res: any) {
    try {
      const { threshold = 10 } = req.query;

      const lowStockProducts = await prisma.product.findMany({
        where: { stock: { lt: parseInt(threshold) } },
        orderBy: { stock: "asc" },
      });

      res.json({
        lowStockProducts,
        threshold: parseInt(threshold),
        count: lowStockProducts.length,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}