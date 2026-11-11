import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserPreferenceController {
  static async get(req: any, res: any) {
    try {
      const userId = req.user?.userId;

      let preferences = await prisma.userPreference.findUnique({ where: { userId } });

      // Create default preferences if not exist
      if (!preferences) {
        preferences = await prisma.userPreference.create({
          data: { userId },
        });
      }

      res.json(preferences);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: any, res: any) {
    try {
      const userId = req.user?.userId;
      const { emailNotifications, lowStockNotifications, orderStatusNotifications, theme, language } = req.body;

      let preferences = await prisma.userPreference.findUnique({ where: { userId } });

      if (!preferences) {
        preferences = await prisma.userPreference.create({
          data: {
            userId,
            emailNotifications: emailNotifications ?? true,
            lowStockNotifications: lowStockNotifications ?? true,
            orderStatusNotifications: orderStatusNotifications ?? true,
            theme: theme ?? "light",
            language: language ?? "en",
          },
        });
      } else {
        preferences = await prisma.userPreference.update({
          where: { userId },
          data: {
            emailNotifications: emailNotifications !== undefined ? emailNotifications : preferences.emailNotifications,
            lowStockNotifications: lowStockNotifications !== undefined ? lowStockNotifications : preferences.lowStockNotifications,
            orderStatusNotifications: orderStatusNotifications !== undefined ? orderStatusNotifications : preferences.orderStatusNotifications,
            theme: theme ?? preferences.theme,
            language: language ?? preferences.language,
          },
        });
      }

      res.json(preferences);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}