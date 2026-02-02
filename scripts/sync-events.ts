import { syncEvents } from "../src/lib/events/sync-service";
import { PrismaClient } from "@prisma/client";

async function main() {
    console.log("🚀 Starting event synchronization...");
    try {
        const stats = await syncEvents();
        console.log("✅ Sync completed successfully!");
        console.log("Ticketmaster:", stats.ticketmaster);
        console.log("Eventbrite:", stats.eventbrite);
    } catch (error) {
        console.error("❌ Sync failed:", error);
        process.exit(1);
    }
}

main();
