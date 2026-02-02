const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkData() {
    console.log('=== Checking Events ===')
    const events = await prisma.event.findMany({
        include: {
            tickets: true,
        },
    })

    console.log('Events:', JSON.stringify(events, null, 2))

    console.log('\n=== Checking Tickets ===')
    const tickets = await prisma.ticket.findMany({
        include: {
            event: true,
            seller: true,
        },
    })

    console.log('Tickets:', JSON.stringify(tickets, null, 2))

    await prisma.$disconnect()
}

checkData()
