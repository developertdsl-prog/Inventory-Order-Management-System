import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ReportController {
  static async salesReport(req: any, res: any) {
    try {
      const { startDate, endDate } = req.query;

      const where: any = {};
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const salesOrders = await prisma.salesOrder.findMany({
        where: { ...where, status: { in: ["CONFIRMED", "SHIPPED", "DELIVERED"] } },
        include: {
          items: { include: { product: { select: { id: true, name: true, sku: true } } } },
        },
        orderBy: { createdAt: "asc" },
      });

      const totalSales = salesOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const totalOrders = salesOrders.length;

      // Group by date for chart data
      const salesByDate: Record<string, { sales: number; orders: number }> = {};
      salesOrders.forEach((order: any) => {
        const date = new Date(order.createdAt).toISOString().split("T")[0];
        if (!salesByDate[date]) {
          salesByDate[date] = { sales: 0, orders: 0 };
        }
        salesByDate[date].sales += order.totalAmount;
        salesByDate[date].orders += 1;
      });

      // Top products
      const productSales: Record<string, { name: string; sku: string; quantity: number; revenue: number }> = {};
      salesOrders.forEach((order: any) => {
        order.items.forEach((item: any) => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = {
              name: item.product.name,
              sku: item.product.sku,
              quantity: 0,
              revenue: 0,
            };
          }
          productSales[item.productId].quantity += item.quantity;
          productSales[item.productId].revenue += item.quantity * item.unitPrice;
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a: any, b: any) => b.revenue - a.revenue)
        .slice(0, 10);

      res.json({
        totalSales,
        totalOrders,
        salesByDate,
        topProducts,
        dateRange: { startDate, endDate },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async purchaseReport(req: any, res: any) {
    try {
      const { startDate, endDate } = req.query;

      const where: any = {};
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const purchaseOrders = await prisma.purchaseOrder.findMany({
        where: { ...where, status: "RECEIVED" },
        include: {
          supplier: { select: { id: true, name: true } },
          items: { include: { product: { select: { id: true, name: true, sku: true } } } },
        },
        orderBy: { createdAt: "asc" },
      });

      const totalPurchases = purchaseOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const totalOrders = purchaseOrders.length;

      // Group by date for chart data
      const purchasesByDate: Record<string, { purchases: number; orders: number }> = {};
      purchaseOrders.forEach((order: any) => {
        const date = new Date(order.createdAt).toISOString().split("T")[0];
        if (!purchasesByDate[date]) {
          purchasesByDate[date] = { purchases: 0, orders: 0 };
        }
        purchasesByDate[date].purchases += order.totalAmount;
        purchasesByDate[date].orders += 1;
      });

      // Top suppliers
      const supplierPurchases: Record<string, { name: string; total: number; orderCount: number }> = {};
      purchaseOrders.forEach((order: any) => {
        const supplierName = order.supplier.name;
        if (!supplierPurchases[supplierName]) {
          supplierPurchases[supplierName] = { name: supplierName, total: 0, orderCount: 0 };
        }
        supplierPurchases[supplierName].total += order.totalAmount;
        supplierPurchases[supplierName].orderCount += 1;
      });

      const topSuppliers = Object.values(supplierPurchases).sort((a: any, b: any) => b.total - a.total);

      res.json({
        totalPurchases,
        totalOrders,
        purchasesByDate,
        topSuppliers,
        dateRange: { startDate, endDate },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async inventoryReport(req: any, res: any) {
    try {
      const products = await prisma.product.findMany({
        include: { category: { select: { id: true, name: true } } },
        orderBy: { name: "asc" },
      });

      // Inventory valuation
      const totalInventoryValue = products.reduce(
        (sum, product) => sum + product.stock * product.price,
        0
      );

      const totalStockQuantity = products.reduce((sum, product) => sum + product.stock, 0);

      // Category breakdown
      const categoryBreakdown: Record<string, { productCount: number; stockValue: number; stockQuantity: number }> = {};
      products.forEach((product: any) => {
        const catName = product.category?.name || "Uncategorized";
        if (!categoryBreakdown[catName]) {
          categoryBreakdown[catName] = { productCount: 0, stockValue: 0, stockQuantity: 0 };
        }
        categoryBreakdown[catName].productCount += 1;
        categoryBreakdown[catName].stockValue += product.stock * product.price;
        categoryBreakdown[catName].stockQuantity += product.stock;
      });

      // Low stock items
      const lowStockItems = products.filter((product: any) => product.stock < 10);

      // Out of stock items
      const outOfStockItems = products.filter((product: any) => product.stock === 0);

      res.json({
        totalInventoryValue,
        totalStockQuantity,
        totalProducts: products.length,
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStockItems.length,
        categoryBreakdown,
        lowStockItems: lowStockItems.slice(0, 20),
        outOfStockItems: outOfStockItems.slice(0, 20),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async dashboardSummary(req: any, res: any) {
    try {
      const [salesCount, purchaseCount, productCount, lowStockCount] = await Promise.all([
        prisma.salesOrder.count({ where: { status: { in: ["CONFIRMED", "SHIPPED", "DELIVERED"] } } }),
        prisma.purchaseOrder.count({ where: { status: "RECEIVED" } }),
        prisma.product.count(),
        prisma.product.count({ where: { stock: { lt: 10 } } }),
      ]);

      const [totalSalesAmount, totalPurchaseAmount, totalInventoryValue] = await Promise.all([
        prisma.salesOrder.aggregate({
          where: { status: { in: ["CONFIRMED", "SHIPPED", "DELIVERED"] } },
          _sum: { totalAmount: true },
        }),
        prisma.purchaseOrder.aggregate({
          where: { status: "RECEIVED" },
          _sum: { totalAmount: true },
        }),
        prisma.product.aggregate({
          _sum: { stock: true },
        }),
      ]);

      // Calculate inventory value roughly (stock * avg price)
      const products = await prisma.product.findMany({ select: { stock: true, price: true } });
      const inventoryValue = products.reduce((sum, p) => sum + p.stock * p.price, 0);

      res.json({
        sales: {
          count: salesCount,
          totalAmount: totalSalesAmount._sum.totalAmount || 0,
        },
        purchases: {
          count: purchaseCount,
          totalAmount: totalPurchaseAmount._sum.totalAmount || 0,
        },
        products: {
          count: productCount,
          lowStockCount,
          totalStockValue: inventoryValue,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}