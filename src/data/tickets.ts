
import { prisma } from "@/lib/db";

export async function getPurchasedTickets(userId: string) {
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                buyerId: userId,
                status: {
                    in: ["PENDING", "COMPLETED"]
                }
            },
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

export async function getSoldTickets(userId: string) {
    try {
        const tickets = await prisma.ticket.findMany({
            where: {
                sellerId: userId,
            },
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
