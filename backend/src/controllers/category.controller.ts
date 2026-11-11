import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CategoryController {
  static async list(req: any, res: any) {
    try {
      const categories = await prisma.category.findMany({
        include: {
          _count: { select: { products: true } },
        },
        orderBy: { name: "asc" },
      });

      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req: any, res: any) {
    try {
      const { name } = req.body;

      const existingCategory = await prisma.category.findUnique({ where: { name } });
      if (existingCategory) {
        return res.status(400).json({ error: "Category already exists" });
      }

      const category = await prisma.category.create({
        data: { name },
      });

      res.status(201).json(category);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: any, res: any) {
    try {
      const { id } = req.params;
      const category = await prisma.category.findUnique({
        where: { id },
        include: { products: true },
      });

      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json(category);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: any, res: any) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const existingCategory = await prisma.category.findUnique({ where: { id } });
      if (!existingCategory) {
        return res.status(404).json({ error: "Category not found" });
      }

      if (name && name !== existingCategory.name) {
        const nameExists = await prisma.category.findUnique({ where: { name } });
        if (nameExists) {
          return res.status(400).json({ error: "Category name already exists" });
        }
      }

      const category = await prisma.category.update({
        where: { id },
        data: { name },
      });

      res.json(category);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async remove(req: any, res: any) {
    try {
      const { id } = req.params;

      const existingCategory = await prisma.category.findUnique({
        where: { id },
        include: { products: true },
      });

      if (!existingCategory) {
        return res.status(404).json({ error: "Category not found" });
      }

      if (existingCategory.products.length > 0) {
        return res.status(400).json({ error: "Cannot delete category with existing products" });
      }

      await prisma.category.delete({ where: { id } });
      res.json({ message: "Category deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}