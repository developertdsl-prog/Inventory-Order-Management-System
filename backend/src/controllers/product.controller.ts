import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ProductController {
  static async list(req: any, res: any) {
    try {
      const { page = 1, limit = 10, search, category } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (search) {
        where.OR = [
          { name: { contains: String(search), mode: "insensitive" } },
          { sku: { contains: String(search), mode: "insensitive" } },
        ];
      }
      if (category) {
        where.categoryId = String(category);
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: Number(limit),
          include: { category: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        }),
        prisma.product.count({ where }),
      ]);

      res.json({
        products,
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
      const { name, description, price, sku, barcode, stock, categoryId, images } = req.body;

      // Validate SKU uniqueness
      const existingProduct = await prisma.product.findUnique({ where: { sku } });
      if (existingProduct) {
        return res.status(400).json({ error: "SKU already exists" });
      }

      // Validate barcode uniqueness if provided
      if (barcode) {
        const existingBarcode = await prisma.product.findUnique({ where: { barcode } });
        if (existingBarcode) {
          return res.status(400).json({ error: "Barcode already exists" });
        }
      }

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          sku,
          barcode,
          stock: stock ? parseInt(stock) : 0,
          categoryId,
          images: images || [],
        },
        include: { category: { select: { id: true, name: true } } },
      });

      res.status(201).json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: any, res: any) {
    try {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: { id },
        include: { category: { select: { id: true, name: true } } },
      });

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: any, res: any) {
    try {
      const { id } = req.params;
      const { name, description, price, sku, barcode, stock, categoryId, images } = req.body;

      const existingProduct = await prisma.product.findUnique({ where: { id } });
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Validate SKU uniqueness if changed
      if (sku !== existingProduct.sku) {
        const skuExists = await prisma.product.findUnique({ where: { sku } });
        if (skuExists) {
          return res.status(400).json({ error: "SKU already exists" });
        }
      }

      // Validate barcode uniqueness if changed
      if (barcode && barcode !== existingProduct.barcode) {
        const barcodeExists = await prisma.product.findUnique({ where: { barcode } });
        if (barcodeExists) {
          return res.status(400).json({ error: "Barcode already exists" });
        }
      }

      const product = await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          price: price ? parseFloat(price) : undefined,
          sku,
          barcode,
          stock: stock !== undefined ? parseInt(stock) : undefined,
          categoryId,
          images,
        },
        include: { category: { select: { id: true, name: true } } },
      });

      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async remove(req: any, res: any) {
    try {
      const { id } = req.params;

      const existingProduct = await prisma.product.findUnique({ where: { id } });
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      await prisma.product.delete({ where: { id } });
      res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}