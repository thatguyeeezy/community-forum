import { PrismaClient } from '@prisma/client'

// Use the DIRECT_URL to test connection
process.env.DATABASE_URL = process.env.DIRECT_URL

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Testing direct database connection...')
    const userCount = await prisma.user.count()
    console.log(`Connection successful! User count: ${userCount}`)
  } catch (error) {
    console.error('Connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()