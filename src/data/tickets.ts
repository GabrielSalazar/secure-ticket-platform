
import { prisma } from "@/lib/db";

export interface TicketFilters {
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    status?: string;
}

export async function getPurchasedTickets(userId: string, filters?: TicketFilters) {
    try {
        const where: any = {
            buyerId: userId,
            status: {
                in: ["PENDING", "COMPLETED"]
            }
        };

        if (filters?.search || filters?.dateFrom || filters?.dateTo) {
            where.ticket = {
                event: {}
            };

            if (filters.search) {
                where.ticket.event.title = { contains: filters.search, mode: 'insensitive' };
            }

            if (filters.dateFrom || filters.dateTo) {
                where.ticket.event.date = {};
                if (filters.dateFrom) where.ticket.event.date.gte = new Date(filters.dateFrom);
                if (filters.dateTo) where.ticket.event.date.lte = new Date(filters.dateTo);
            }
        }

        const transactions = await prisma.transaction.findMany({
            where,
            include: {
                ticket: {
                    include: {
                        event: true,
                        seller: {
                            select: {
                                name: true,
                                email: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        // Flatten the structure to return tickets
        return transactions.map(tx => ({
            ...tx.ticket,
            purchaseDate: tx.createdAt,
            transactionId: tx.id
        }));
    } catch (error) {
        console.error("Error fetching purchased tickets:", error);
        return [];
    }
}

export async function getSoldTickets(userId: string, filters?: TicketFilters) {
    try {
        const where: any = {
            sellerId: userId,
        };

        if (filters?.status && filters.status !== 'ALL') {
            where.status = filters.status;
        }

        if (filters?.search || filters?.dateFrom || filters?.dateTo) {
            where.event = {};

            if (filters.search) {
                where.event.title = { contains: filters.search, mode: 'insensitive' };
            }

            if (filters.dateFrom || filters.dateTo) {
                where.event.date = {};
                if (filters.dateFrom) where.event.date.gte = new Date(filters.dateFrom);
                if (filters.dateTo) where.event.date.lte = new Date(filters.dateTo);
            }
        }

        const tickets = await prisma.ticket.findMany({
            where,
            include: {
                event: true,
                transaction: {
                    include: {
                        buyer: {
                            select: {
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return tickets;
    } catch (error) {
        console.error("Error fetching sold tickets:", error);
        return [];
    }
}
