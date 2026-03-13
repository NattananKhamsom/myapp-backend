const prisma = require('../utils/prisma');

/**
 * Create a blacklist ticket (yellow/red card) for a user.
 * Auto-blacklists the user when:
 *   - 1 RED card  → immediate blacklist
 *   - 2 YELLOW cards total → blacklist
 */
const createTicket = async ({ userId, cardType, category, reason, issuedBy }) => {
    // Create the ticket
    const ticket = await prisma.blacklistedTicket.create({
        data: { userId, cardType, category, reason, issuedBy },
    });

    // Count cards for this user (including the one just created)
    const yellowCount = await prisma.blacklistedTicket.count({
        where: { userId, cardType: 'YELLOW' },
    });

    const shouldBlacklist = cardType === 'RED' || yellowCount >= 2;

    if (shouldBlacklist) {
        // Build a combined reason from all tickets
        const allTickets = await prisma.blacklistedTicket.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
        });

        const combinedReason = allTickets
            .map((t, i) => `[${t.cardType} #${i + 1}] [${t.category}] ${t.reason}`)
            .join(' | ');

        await prisma.user.update({
            where: { id: userId },
            data: {
                isBlacklisted: true,
                isActive: false,
                blacklistReason: combinedReason,
            },
        });
    }

    return {
        ticket,
        shouldBlacklist,
        yellowCount,
    };
};

/**
 * Get all tickets for a specific user, newest first.
 */
const getTicketsByUser = async (userId) => {
    return prisma.blacklistedTicket.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
};

/**
 * Get a single ticket by ID.
 */
const getTicketById = async (id) => {
    return prisma.blacklistedTicket.findUnique({ where: { id } });
};

module.exports = {
    createTicket,
    getTicketsByUser,
    getTicketById,
};
