import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CustomerController {
  static async list(req: any, res: any) {
    try {
      const customers = await prisma.customer.findMany({
        orderBy: { name: "asc" },
      });

      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req: any, res: any) {
    try {
      const { name, email, phone, address } = req.body;

      const existingCustomer = await prisma.customer.findUnique({ where: { email } });
      if (existingCustomer) {
        return res.status(400).json({ error: "Customer email already exists" });
      }

      const customer = await prisma.customer.create({
        data: { name, email, phone, address },
      });

      res.status(201).json(customer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: any, res: any) {
    try {
      const { id } = req.params;
      const customer = await prisma.customer.findUnique({
        where: { id },
        include: {
          salesOrders: {
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      });

      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      res.json(customer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: any, res: any) {
    try {
      const { id } = req.params;
      const { name, email, phone, address } = req.body;

      const existingCustomer = await prisma.customer.findUnique({ where: { id } });
      if (!existingCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      if (email && email !== existingCustomer.email) {
        const emailExists = await prisma.customer.findUnique({ where: { email } });
        if (emailExists) {
          return res.status(400).json({ error: "Customer email already exists" });
        }
      }

      const customer = await prisma.customer.update({
        where: { id },
        data: { name, email, phone, address },
      });

      res.json(customer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async remove(req: any, res: any) {
    try {
      const { id } = req.params;

      const existingCustomer = await prisma.customer.findUnique({
        where: { id },
        include: { salesOrders: true },
      });

      if (!existingCustomer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      if (existingCustomer.salesOrders.length > 0) {
        return res.status(400).json({ error: "Cannot delete customer with existing sales orders" });
      }

      await prisma.customer.delete({ where: { id } });
      res.json({ message: "Customer deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}