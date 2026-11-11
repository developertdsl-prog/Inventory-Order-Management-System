import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class SystemConfigController {
  static async list(req: any, res: any) {
    try {
      const { category } = req.query;

      const where: any = {};
      if (category) where.category = String(category);

      const configs = await prisma.systemConfig.findMany({
        where,
        orderBy: { key: "asc" },
      });

      // Convert to key-value map
      const configMap: Record<string, string> = {};
      configs.forEach((c: any) => {
        configMap[c.key] = c.value;
      });

      res.json({ configs, configMap });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async get(req: any, res: any) {
    try {
      const { key } = req.params;

      const config = await prisma.systemConfig.findUnique({ where: { key } });
      if (!config) {
        return res.status(404).json({ error: "Configuration not found" });
      }

      res.json(config);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: any, res: any) {
    try {
      const { key } = req.params;
      const { value, category } = req.body;

      const existingConfig = await prisma.systemConfig.findUnique({ where: { key } });
      if (!existingConfig) {
        return res.status(404).json({ error: "Configuration not found" });
      }

      const config = await prisma.systemConfig.update({
        where: { key },
        data: { value, category },
      });

      res.json(config);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req: any, res: any) {
    try {
      const { key, value, category } = req.body;

      const existingConfig = await prisma.systemConfig.findUnique({ where: { key } });
      if (existingConfig) {
        return res.status(400).json({ error: "Configuration key already exists" });
      }

      const config = await prisma.systemConfig.create({
        data: { key, value, category },
      });

      res.status(201).json(config);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}