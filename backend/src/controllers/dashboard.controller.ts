import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DashboardController {
  static async getSummary(req: any, res: any) {
    try {
      const [totalProducts, totalOrders, stockStats, recentOrders, lowStockStats] = await Promise.all([
        prisma.product.count(),
        prisma.purchaseOrder.count(),
        prisma.inventoryTransaction.groupBy({
          by: ["type"],
          _sum: { quantity: true },
          where: { type: "STOCK_IN" },
        }),
        prisma.inventoryTransaction.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        prisma.inventoryTransaction.groupBy({
          by: ["type"],
          _sum: { quantity: true },
          where: { type: "STOCK_OUT" },
        }),
      ]);

      // Calculate stock statistics from transactions
      const totalStockIn = stockStats._sum.quantity || 0;
      const totalStockOut = lowStockStats._sum.quantity || 0;
      const netStock = totalStockIn - totalStockOut;

      res.json({
        totalProducts,
        totalOrders,
        stock: {
          netStock,
          totalStockIn,
          totalStockOut,
        },
        recentOrders,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getLowStockStats(req: any, res: any) {
    try {
      // Get products with low stock (simplified - in real app would have stock threshold)
      const products = await prisma.product.findMany({
        where: { stock: { lt: 10 } },
        take: 10,
        orderBy: { stock: "asc" },
      });

      res.json({ lowStockProducts: products });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}