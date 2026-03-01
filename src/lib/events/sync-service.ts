import { prisma } from "@/lib/db";
import { fetchTicketmasterEvents, mapTicketmasterToPrisma } from "../event-apis/ticketmaster";
import { fetchEventbriteEvents, mapEventbriteToPrisma } from "../event-apis/eventbrite";
import { EventSource } from "@prisma/client";

export async function syncEvents() {
    const stats = {
        ticketmaster: { imported: 0, skipped: 0, errors: 0 },
        eventbrite: { imported: 0, skipped: 0, errors: 0 },
        citiesProcessed: 0,
    };

    // Major Brazilian Cities to fetch events for
    const targetCities = ["Sao Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Brasilia"];

    // 1. Get a default organizer (Admin)
    const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' }
    }) || await prisma.user.findFirst();

    if (!adminUser) {
        throw new Error("No user found in database to act as event organizer");
    }

    // 2. Sync Ticketmaster
    console.log("Syncing Ticketmaster events...");
    for (const city of targetCities) {
        try {
            const tmEvents = await fetchTicketmasterEvents(city);
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
        } catch (cityErr) {
            console.error(`Error fetching Ticketmaster events for ${city}:`, cityErr);
        }
    }

    // 3. Sync Eventbrite
    console.log("Syncing Eventbrite events...");
    for (const city of targetCities) {
        try {
            const ebEvents = await fetchEventbriteEvents(city);
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
        } catch (cityErr) {
            console.error(`Error fetching Eventbrite events for ${city}:`, cityErr);
        }
        stats.citiesProcessed++;
    }

    return stats;
}
