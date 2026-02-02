export interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    image: string;
    priceRange: {
        min: number;
        max: number;
    };
    totalTickets: number;
    category: string;
}

export const MOCK_EVENTS: Event[] = [
    {
        id: "1",
        title: "Festival de Verão 2026",
        date: "2026-02-22T14:00:00",
        location: "Allianz Parque, São Paulo",
        image: "/placeholder-event-1.jpg",
        priceRange: { min: 250, max: 450 },
        totalTickets: 12,
        category: "Show"
    },
    {
        id: "2",
        title: "Coldplay - Music of the Spheres",
        date: "2026-03-15T20:00:00",
        location: "Estádio do Morumbi, São Paulo",
        image: "/placeholder-event-2.jpg",
        priceRange: { min: 380, max: 890 },
        totalTickets: 45,
        category: "Show"
    },
    {
        id: "3",
        title: "Tech Summit Rio",
        date: "2026-04-10T09:00:00",
        location: "Riocentro, Rio de Janeiro",
        image: "/placeholder-event-3.jpg",
        priceRange: { min: 150, max: 300 },
        totalTickets: 8,
        category: "Conferência"
    },
    {
        id: "4",
        title: "Campeonato Brasileiro: Final",
        date: "2026-12-05T16:00:00",
        location: "Maracanã, Rio de Janeiro",
        image: "/placeholder-event-4.jpg",
        priceRange: { min: 80, max: 200 },
        totalTickets: 150,
        category: "Esporte"
    },
    {
        id: "5",
        title: "Teatro Mágico - Turnê 20 Anos",
        date: "2026-05-20T21:00:00",
        location: "Teatro Bradesco, São Paulo",
        image: "/placeholder-event-5.jpg",
        priceRange: { min: 120, max: 280 },
        totalTickets: 5,
        category: "Teatro"
    },
    {
        id: "6",
        title: "Festival de Jazz de Paraty",
        date: "2026-06-12T18:00:00",
        location: "Centro Histórico, Paraty",
        image: "/placeholder-event-6.jpg",
        priceRange: { min: 0, max: 0 },
        totalTickets: 30,
        category: "Festival"
    }
];
