import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' }
  })

  if (existingAdmin) {
    console.log('👤 Admin user already exists')
    return
  }

  // Create admin user (password will be set through Better Auth signup)
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      emailVerified: true,
    }
  })

  console.log('✅ Admin user created:', adminUser.email)
  console.log('📧 Email: admin@example.com')
  console.log('🔑 Use the signup form to set password: admin123')
  console.log('ℹ️  The user record exists, now sign up with this email to set the password')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })