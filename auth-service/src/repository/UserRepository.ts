import { PrismaClient } from "../generated/prisma";
import { User } from '../models/User'

const prisma = new PrismaClient()

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
}