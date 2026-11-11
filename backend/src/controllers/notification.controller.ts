import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class NotificationController {
  static async list(req: any, res: any) {
    try {
      const { page = 1, limit = 20, unreadOnly } = req.query;
      const skip = (Number(page) - 1) * Number(limit);
      const userId = req.user?.userId;

      const where: any = { userId };
      if (unreadOnly === "true") {
        where.read = false;
      }

      const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { createdAt: "desc" },
        }),
        prisma.notification.count({ where }),
      ]);

      res.json({
        notifications,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        unreadCount: await prisma.notification.count({ where: { userId, read: false } }),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async markAsRead(req: any, res: any) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const notification = await prisma.notification.findUnique({ where: { id } });
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      if (notification.userId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const updated = await prisma.notification.update({
        where: { id },
        data: { read: true },
      });

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async markAllAsRead(req: any, res: any) {
    try {
      const userId = req.user?.userId;

      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });

      res.json({ message: "All notifications marked as read" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createNotification(req: any, res: any) {
    try {
      const { userId, title, message, type } = req.body;

      const notification = await prisma.notification.create({
        data: { userId, title, message, type },
      });

      res.status(201).json(notification);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}