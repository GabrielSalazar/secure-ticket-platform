import { prisma } from "@/lib/db";
import { fetchTicketmasterEvents, mapTicketmasterToPrisma } from "../event-apis/ticketmaster";
import { fetchEventbriteEvents, mapEventbriteToPrisma } from "../event-apis/eventbrite";
import { EventSource } from "@prisma/client";

export async function syncEvents() {
    const stats = {
        ticketmaster: { imported: 0, skipped: 0, errors: 0 },
        eventbrite: { imported: 0, skipped: 0, errors: 0 },
    };

    // 1. Get a default organizer (Admin)
    // In a real app, this would be a specific system user
    const adminUser = await prisma.user.findFirst({
        where: { email: { contains: "admin" } }
    }) || await prisma.user.findFirst();

    if (!adminUser) {
        throw new Error("No user found in database to act as event organizer");
    }

    // 2. Sync Ticketmaster
    console.log("Syncing Ticketmaster events...");
    const tmEvents = await fetchTicketmasterEvents();
    for (const tmEvent of tmEvents) {
        try {
            const mapped = mapTicketmasterToPrisma(tmEvent);

            await prisma.event.upsert({
                where: { externalId: mapped.externalId },
                update: {
                    ...mapped,
                    organizerId: adminUser.id,
                },
                create: {
                    ...mapped,
                    organizerId: adminUser.id,
                },
            });
            stats.ticketmaster.imported++;
        } catch (err) {
            console.error(`Failed to sync Ticketmaster event ${tmEvent.id}:`, err);
            stats.ticketmaster.errors++;
        }
    }

    // 3. Sync Eventbrite
    console.log("Syncing Eventbrite events...");
    const ebEvents = await fetchEventbriteEvents();
    for (const ebEvent of ebEvents) {
        try {
            const mapped = mapEventbriteToPrisma(ebEvent);

            await prisma.event.upsert({
                where: { externalId: mapped.externalId },
                update: {
                    ...mapped,
                    organizerId: adminUser.id,
                },
                create: {
                    ...mapped,
                    organizerId: adminUser.id,
                },
            });
            stats.eventbrite.imported++;
        } catch (err) {
            console.error(`Failed to sync Eventbrite event ${ebEvent.id}:`, err);
            stats.eventbrite.errors++;
        }
    }

    return stats;
}
