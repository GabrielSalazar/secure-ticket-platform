import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    const seller = await prisma.user.upsert({
        where: { email: 'seller@example.com' },
        update: {},
        create: {
            email: 'seller@example.com',
            name: 'Alice Seller',
            password: 'hashed-password-placeholder', // In real app, hash this
            role: Role.SELLER,
        },
    })

    const buyer = await prisma.user.upsert({
        where: { email: 'buyer@example.com' },
        update: {},
        create: {
            email: 'buyer@example.com',
            name: 'Bob Buyer',
            password: 'hashed-password-placeholder',
            role: Role.BUYER,
        },
    })

    const event = await prisma.event.upsert({
        where: { id: 'event-1' }, // CUIDs are usually random, but for seed we can force one or check by other fields. 
        // Since id is default(cuid), upsert by ID might fail if we don't provide it.
        // Better to create if not exists using a different unique field, but Event doesn't have one.
        // We'll just create one if we can't find the seller's events.
        update: {},
        create: {
            title: 'Summer Music Festival',
            description: 'The best music festival of the year!',
            location: 'Central Park, NY',
            date: new Date('2026-07-15T18:00:00Z'),
            organizerId: seller.id,
            tickets: {
                create: [
                    {
                        price: 50.0,
                        section: 'General Admission',
                        sellerId: seller.id,
                    },
                    {
                        price: 150.0,
                        section: 'VIP',
                        row: 'A',
                        seat: '1',
                        sellerId: seller.id,
                    },
                ],
            },
        },
    })

    console.log({ seller, buyer, event })
    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
