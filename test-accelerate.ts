import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// Create Prisma client with Accelerate extension
const prisma = new PrismaClient().$extends(withAccelerate())

async function testAccelerate() {
  console.log('Testing Prisma Accelerate setup...')
  
  try {
    // First query - should hit the database
    console.time('First query')
    const firstResult = await prisma.user.findMany({ 
      where: {
        email: { 
          contains: "alice@prisma.io",
        },
      },
      cacheStrategy: { ttl: 60 }, // Cache for 60 seconds
    })
    console.timeEnd('First query')
    console.log(`Found ${firstResult.length} users on first query`)
    
    // Second query - should hit the cache
    console.time('Second query (should be cached)')
    const secondResult = await prisma.user.findMany({ 
      where: {
        email: { 
          contains: "alice@prisma.io",
        },
      },
      cacheStrategy: { ttl: 60 },
    })
    console.timeEnd('Second query (should be cached)')
    console.log(`Found ${secondResult.length} users on second query`)
    
    // Query with different parameters - should hit the database
    console.time('Different query')
    const differentResult = await prisma.user.findMany({ 
      where: {
        email: { 
          contains: "bob@prisma.io",
        },
      },
      cacheStrategy: { ttl: 60 },
    })
    console.timeEnd('Different query')
    console.log(`Found ${differentResult.length} users with different parameters`)
    
    console.log('\nAccelerate setup verification complete!')
    
    // If the second query is significantly faster than the first,
    // Accelerate caching is working correctly
    
  } catch (error) {
    console.error('Error testing Accelerate:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAccelerate()