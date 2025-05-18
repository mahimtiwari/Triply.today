import { PrismaClient } from '../app/generated/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // optional: logs queries for debugging
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
