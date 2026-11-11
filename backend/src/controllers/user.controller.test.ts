import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { PrismaClient } from "@prisma/client";

describe("User Controller", () => {
  const prisma = new PrismaClient();

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it("should create a new user", async () => {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: "hashed_password",
        role: "USER",
      },
    });

    expect(user).toBeDefined();
    expect(user.email).toBe("test@example.com");
    expect(user.role).toBe("USER");
  });

  it("should find user by email", async () => {
    await prisma.user.create({
      data: {
        email: "find@example.com",
        password: "hashed_password",
        role: "USER",
      },
    });

    const user = await prisma.user.findUnique({
      where: { email: "find@example.com" },
    });

    expect(user).toBeDefined();
    expect(user?.email).toBe("find@example.com");
  });

  it("should update user role", async () => {
    const user = await prisma.user.create({
      data: {
        email: "update@example.com",
        password: "hashed_password",
        role: "USER",
      },
    });

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" },
    });

    expect(updated.role).toBe("ADMIN");
  });
});