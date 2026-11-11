import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class SupplierController {
  static async list(req: any, res: any) {
    try {
      const suppliers = await prisma.supplier.findMany({
        include: {
          _count: { select: { purchaseOrders: true } },
        },
        orderBy: { name: "asc" },
      });

      res.json(suppliers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req: any, res: any) {
    try {
      const { name, contact } = req.body;

      const existingSupplier = await prisma.supplier.findUnique({ where: { name } });
      if (existingSupplier) {
        return res.status(400).json({ error: "Supplier already exists" });
      }

      const supplier = await prisma.supplier.create({
        data: { name, contact },
      });

      res.status(201).json(supplier);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: any, res: any) {
    try {
      const { id } = req.params;
      const supplier = await prisma.supplier.findUnique({
        where: { id },
        include: {
          purchaseOrders: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      });

      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }

      res.json(supplier);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: any, res: any) {
    try {
      const { id } = req.params;
      const { name, contact } = req.body;

      const existingSupplier = await prisma.supplier.findUnique({ where: { id } });
      if (!existingSupplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }

      if (name && name !== existingSupplier.name) {
        const nameExists = await prisma.supplier.findUnique({ where: { name } });
        if (nameExists) {
          return res.status(400).json({ error: "Supplier name already exists" });
        }
      }

      const supplier = await prisma.supplier.update({
        where: { id },
        data: { name, contact },
      });

      res.json(supplier);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async remove(req: any, res: any) {
    try {
      const { id } = req.params;

      const existingSupplier = await prisma.supplier.findUnique({
        where: { id },
        include: { purchaseOrders: true },
      });

      if (!existingSupplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }

      if (existingSupplier.purchaseOrders.length > 0) {
        return res.status(400).json({ error: "Cannot delete supplier with existing purchase orders" });
      }

      await prisma.supplier.delete({ where: { id } });
      res.json({ message: "Supplier deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}