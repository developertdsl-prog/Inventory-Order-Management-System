import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PurchaseOrderController {
  static async list(req: any, res: any) {
    try {
      const { page = 1, limit = 10, status, supplierId } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (status) where.status = String(status);
      if (supplierId) where.supplierId = String(supplierId);

      const [purchaseOrders, total] = await Promise.all([
        prisma.purchaseOrder.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            supplier: { select: { id: true, name: true } },
            items: { include: { product: { select: { id: true, name: true, sku: true } } } },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.purchaseOrder.count({ where }),
      ]);

      res.json({
        purchaseOrders,
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
      const { supplierId, items } = req.body;

      if (!supplierId || !items || items.length === 0) {
        return res.status(400).json({ error: "Supplier and at least one item are required" });
      }

      const supplier = await prisma.supplier.findUnique({ where: { id: supplierId } });
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }

      let totalAmount = 0;
      const validatedItems = items.map((item: any) => {
        totalAmount += parseFloat(item.unitPrice) * parseInt(item.quantity);
        return {
          productId: item.productId,
          quantity: parseInt(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          received: 0,
        };
      });

      const purchaseOrder = await prisma.purchaseOrder.create({
        data: {
          supplierId,
          status: "PENDING",
          totalAmount,
          items: {
            create: validatedItems,
          },
        },
        include: {
          supplier: { select: { id: true, name: true } },
          items: { include: { product: { select: { id: true, name: true, sku: true } } } },
        },
      });

      res.status(201).json(purchaseOrder);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: any, res: any) {
    try {
      const { id } = req.params;
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { id },
        include: {
          supplier: { select: { id: true, name: true, contact: true } },
          items: { include: { product: { select: { id: true, name: true, sku: true } } } },
        },
      });

      if (!purchaseOrder) {
        return res.status(404).json({ error: "Purchase order not found" });
      }

      res.json(purchaseOrder);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateStatus(req: any, res: any) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ["PENDING", "APPROVED", "RECEIVED", "CANCELLED"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const existingPO = await prisma.purchaseOrder.findUnique({ where: { id } });
      if (!existingPO) {
        return res.status(404).json({ error: "Purchase order not found" });
      }

      const purchaseOrder = await prisma.purchaseOrder.update({
        where: { id },
        data: { status },
        include: {
          supplier: { select: { id: true, name: true } },
          items: { include: { product: { select: { id: true, name: true, sku: true } } } },
        },
      });

      res.json(purchaseOrder);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async receiveGoods(req: any, res: any) {
    try {
      const { id } = req.params;

      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { id },
        include: {
          items: { include: { product: true } },
        },
      });

      if (!purchaseOrder) {
        return res.status(404).json({ error: "Purchase order not found" });
      }

      if (purchaseOrder.received) {
        return res.status(400).json({ error: "Purchase order already received" });
      }

      // Use transaction to update stock and mark items as received
      const result = await prisma.$transaction([
        // Update each product stock
        ...purchaseOrder.items.map((item: any) =>
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity - item.received } },
          })
        ),
        // Mark items as received
        ...purchaseOrder.items.map((item: any) =>
          prisma.purchaseOrderItem.update({
            where: { id: item.id },
            data: { received: item.quantity },
          })
        ),
        // Mark PO as received
        prisma.purchaseOrder.update({
          where: { id },
          data: { status: "RECEIVED", received: true },
        }),
        // Create inventory transactions for received items
        ...purchaseOrder.items.map((item: any) =>
          prisma.inventoryTransaction.create({
            data: {
              productId: item.productId,
              type: "STOCK_IN",
              quantity: item.quantity - item.received,
              referenceId: id,
              referenceType: "PurchaseOrder",
            },
          })
        ),
      ]);

      const updatedPO = result[result.length - 1];
      res.json({
        message: "Goods received successfully",
        purchaseOrder: updatedPO,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}