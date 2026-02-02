import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function ensureUser() {
    const userId = process.argv[2]
    const email = process.argv[3]
    const name = process.argv[4] || email?.split('@')[0] || 'User'

    if (!userId || !email) {
        console.error('Usage: tsx scripts/ensure-user.ts <userId> <email> [name]')
        process.exit(1)
    }

    try {
        const user = await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: {
                id: userId,
                email,
                name,
                password: '',
                role: 'BUYER',
            },
        })

        console.log('✅ User ensured:', user)
    } catch (error) {
        console.error('❌ Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

ensureUser()
