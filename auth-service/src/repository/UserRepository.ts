import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { User } from '../models/User'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

export class UserRepository {
  async create(data: { email: string, password: string }): Promise<User> {
    return prisma.user.create({
      data,
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    })
  }

  async markAsVerified(email: string): Promise<User> {
    return prisma.user.update({
      where: { email },
      data: { isVerified: true },
    })
  }
}