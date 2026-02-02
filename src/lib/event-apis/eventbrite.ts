import { EventCategory, EventSource } from "@prisma/client";

const EVENTBRITE_API_TOKEN = process.env.EVENTBRITE_API_TOKEN;
const EVENTBRITE_BASE_URL = "https://www.eventbriteapi.com/v3";

export interface EventbriteEvent {
    id: string;
    name: { text: string };
    description: { text: string };
    url: string;
    start: { utc: string; local: string };
    logo?: { url: string };
    venue_id?: string;
    category_id?: string;
    venue?: {
        name: string;
        address: {
            city: string;
            region: string; // State
            address_1: string;
        };
    };
}

export async function fetchEventbriteEvents(city: string = "Sao Paulo") {
    if (!EVENTBRITE_API_TOKEN) {
        console.warn("EVENTBRITE_API_TOKEN is not defined");
        return [];
    }

    try {
        // Note: Eventbrite usually requires an organization ID or location search
        // Using location.address and expand=venue
        const params = new URLSearchParams({
            token: EVENTBRITE_API_TOKEN,
            "location.address": city,
            "location.within": "50km",
            expand: "venue",
            status: "live",
        });

        const response = await fetch(`${EVENTBRITE_BASE_URL}/events/search/?${params.toString()}`);

        if (!response.ok) {
            // Fallback or more specific search if search/ is deprecated for some tokens
            // Eventbrite API changes frequently
            throw new Error(`Eventbrite API error: ${response.statusText}`);
        }

        const data = await response.json();
        return (data.events as EventbriteEvent[]) || [];
    } catch (error) {
        console.error("Error fetching from Eventbrite:", error);
        return [];
    }
}

export function mapEventbriteToPrisma(ebEvent: EventbriteEvent) {
    const venue = ebEvent.venue;

    // Map Category based on category_id if available (simplified for now)
    // Real implementation would fetch categories or map common IDs
    let category: EventCategory = EventCategory.OTHER;

    // Mapping based on common EB IDs if known, or keywords in name
    const name = ebEvent.name.text.toLowerCase();
    if (name.includes("fest") || name.includes("festival")) {
        category = EventCategory.FESTIVAL;
    } else if (name.includes("concurso") || name.includes("show") || name.includes("concerto")) {
        category = EventCategory.CONCERT;
    }

    return {
        title: ebEvent.name.text,
        description: ebEvent.description.text || `Evento ${ebEvent.name.text} em ${venue?.name || "local informado"}.`,
        location: venue?.name || venue?.address.address_1 || "Local não informado",
        venue: venue?.name,
        city: venue?.address.city,
        state: venue?.address.region,
        date: new Date(ebEvent.start.utc),
        imageUrl: ebEvent.logo?.url,
        source: EventSource.EVENTBRITE,
        externalId: ebEvent.id,
        verified: true,
        category,
    };
}
