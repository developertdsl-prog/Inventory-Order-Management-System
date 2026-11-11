import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class SalesOrderController {
  static async list(req: any, res: any) {
    try {
      const { page = 1, limit = 10, status, customerId } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (status) where.status = String(status);
      if (customerId) where.customerId = String(customerId);

      const [salesOrders, total] = await Promise.all([
        prisma.salesOrder.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            customer: { select: { id: true, name: true, email: true } },
            items: { include: { product: { select: { id: true, name: true, sku: true } } } },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.salesOrder.count({ where }),
      ]);

      res.json({
        salesOrders,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req: any, res: any) {
    try {
      const { customerId, items } = req.body;

      if (!customerId || !items || items.length === 0) {
        return res.status(400).json({ error: "Customer and at least one item are required" });
      }

      const customer = await prisma.customer.findUnique({ where: { id: customerId } });
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      let totalAmount = 0;
      const validatedItems = items.map((item: any) => {
        totalAmount += parseFloat(item.unitPrice) * parseInt(item.quantity);
        return {
          productId: item.productId,
          quantity: parseInt(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
        };
      });

      const salesOrder = await prisma.salesOrder.create({
        data: {
          customerId,
          status: "PENDING",
          totalAmount,
          items: {
            create: validatedItems,
          },
        },
        include: {
          customer: { select: { id: true, name: true } },
          items: { include: { product: { select: { id: true, name: true, sku: true } } } },
        },
      });

      res.status(201).json(salesOrder);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: any, res: any) {
    try {
      const { id } = req.params;
      const salesOrder = await prisma.salesOrder.findUnique({
        where: { id },
        include: {
          customer: { select: { id: true, name: true, email: true, phone: true, address: true } },
          items: { include: { product: { select: { id: true, name: true, sku: true } } } },
        },
      });

      if (!salesOrder) {
        return res.status(404).json({ error: "Sales order not found" });
      }

      res.json(salesOrder);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateStatus(req: any, res: any) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const existingOrder = await prisma.salesOrder.findUnique({ where: { id } });
      if (!existingOrder) {
        return res.status(404).json({ error: "Sales order not found" });
      }

      // When confirming order, deduct stock from products
      if (status === "CONFIRMED" && existingOrder.status !== "CONFIRMED") {
        // Check stock availability for all items first
        for (const item of existingOrder.items) {
          const product = await prisma.product.findUnique({ where: { id: item.productId } });
          if (!product) {
            return res.status(400).json({ error: `Product ${item.productId} not found` });
          }
          if (product.stock < item.quantity) {
            return res.status(400).json({
              error: `Insufficient stock for product ${product.name}`,
              currentStock: product.stock,
              requested: item.quantity,
            });
          }
        }

        // Deduct stock using transaction
        await prisma.$transaction([
          ...existingOrder.items.map((item: any) =>
            prisma.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            })
          ),
          ...existingOrder.items.map((item: any) =>
            prisma.inventoryTransaction.create({
              data: {
                productId: item.productId,
                type: "STOCK_OUT",
                quantity: item.quantity,
                referenceId: id,
                referenceType: "SalesOrder",
              },
            })
          ),
        ]);
      }

      const salesOrder = await prisma.salesOrder.update({
        where: { id },
        data: { status },
        include: {
          customer: { select: { id: true, name: true } },
          items: { include: { product: { select: { id: true, name: true, sku: true } } } },
        },
      });

      res.json(salesOrder);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async cancelOrder(req: any, res: any) {
    try {
      const { id } = req.params;

      const existingOrder = await prisma.salesOrder.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!existingOrder) {
        return res.status(404).json({ error: "Sales order not found" });
      }

      if (existingOrder.status === "DELIVERED") {
        return res.status(400).json({ error: "Cannot cancel a delivered order" });
      }

      const salesOrder = await prisma.salesOrder.update({
        where: { id },
        data: { status: "CANCELLED" },
      });

      res.json(salesOrder);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}