import { EventCategory, EventSource } from "@prisma/client";

const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;
const TICKETMASTER_BASE_URL = "https://app.ticketmaster.com/discovery/v2";

export interface TicketmasterEvent {
    id: string;
    name: string;
    description?: string;
    url: string;
    images: Array<{ url: string; ratio: string; width: number; height: number }>;
    dates: {
        start: {
            dateTime: string;
            localDate: string;
            localTime: string;
        };
    };
    classifications: Array<{
        segment: { name: string };
        genre?: { name: string };
        subGenre?: { name: string };
    }>;
    _embedded?: {
        venues: Array<{
            name: string;
            city: { name: string };
            state: { stateCode: string; name: string };
            address: { line1: string };
            location: { longitude: string; latitude: string };
        }>;
    };
}

export async function fetchTicketmasterEvents(city?: string, classificationName: string = "Music") {
    if (!TICKETMASTER_API_KEY) {
        console.warn("TICKETMASTER_API_KEY is not defined");
        return [];
    }

    try {
        const params = new URLSearchParams({
            apikey: TICKETMASTER_API_KEY,
            countryCode: "BR", // Brazil
            classificationName,
            size: "20",
        });

        if (city) {
            params.append("city", city);
        }

        const response = await fetch(`${TICKETMASTER_BASE_URL}/events.json?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`Ticketmaster API error: ${response.statusText}`);
        }

        const data = await response.json();
        return (data._embedded?.events as TicketmasterEvent[]) || [];
    } catch (error) {
        console.error("Error fetching from Ticketmaster:", error);
        return [];
    }
}

export function mapTicketmasterToPrisma(tmEvent: TicketmasterEvent) {
    const venue = tmEvent._embedded?.venues?.[0];
    const dateStr = tmEvent.dates.start.dateTime || `${tmEvent.dates.start.localDate}T${tmEvent.dates.start.localTime}Z`;

    // Find the best image (usually 16_9 ratio)
    const image = tmEvent.images.find(img => img.ratio === "16_9") || tmEvent.images[0];

    // Map Category
    let category: EventCategory = EventCategory.OTHER;
    const segment = tmEvent.classifications?.[0]?.segment?.name;
    const genre = tmEvent.classifications?.[0]?.genre?.name;

    if (segment === "Music") {
        category = genre?.toLowerCase().includes("festival") ? EventCategory.FESTIVAL : EventCategory.CONCERT;
    } else if (segment === "Sports") {
        category = EventCategory.SPORTS;
    } else if (segment === "Arts & Theatre") {
        category = genre?.toLowerCase().includes("comedy") ? EventCategory.COMEDY : EventCategory.THEATER;
    }

    return {
        title: tmEvent.name,
        description: tmEvent.description || `Evento ${tmEvent.name} no ${venue?.name || "local informado"}.`,
        location: venue?.name || "Local não informado",
        venue: venue?.name,
        city: venue?.city?.name,
        state: venue?.state?.stateCode || venue?.state?.name,
        date: new Date(dateStr),
        imageUrl: image?.url,
        source: EventSource.TICKETMASTER,
        externalId: tmEvent.id,
        verified: true, // Events from official APIs are verified by default
        category,
    };
}
