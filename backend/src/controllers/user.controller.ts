import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export class UserController {
  static async register(req: any, res: any) {
    const { email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, role: "USER" },
      });
      res.json({ id: user.id, email: user.email, role: user.role });
    } catch (error: any) {
      if (error.code === "P2002") {
        res.status(400).json({ error: "Email already exists" });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  static async login(req: any, res: any) {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(404).json({ error: "User not found" });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(401).json({ error: "Invalid password" });

      const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN });
      res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProfile(req: any, res: any) {
    const userId = req.user?.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    res.json(user ? { id: user.id, email: user.email, role: user.role } : { error: "User not found" });
  }
}