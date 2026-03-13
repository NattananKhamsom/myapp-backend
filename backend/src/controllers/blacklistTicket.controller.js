const asyncHandler = require('express-async-handler');
const ticketService = require('../services/blacklistTicket.service');
const ApiError = require('../utils/ApiError');

/**
 * POST /api/blacklist-tickets
 * Admin creates a yellow or red card ticket against a user.
 */
const createTicket = asyncHandler(async (req, res) => {
    const { userId, cardType, category, reason } = req.body;
    const issuedBy = req.user.sub; // admin's user ID from JWT

    const result = await ticketService.createTicket({
        userId,
        cardType,
        category,
        reason,
        issuedBy,
    });

    res.status(201).json({
        success: true,
        message: result.shouldBlacklist
            ? 'Ticket created — user has been blacklisted'
            : 'Ticket created — warning issued',
        data: result,
    });
});

/**
 * GET /api/blacklist-tickets?userId=xxx
 * List all tickets for a user.
 */
const getTicketsByUser = asyncHandler(async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        throw new ApiError(400, 'userId query parameter is required');
    }

    const tickets = await ticketService.getTicketsByUser(userId);

    res.status(200).json({
        success: true,
        message: 'Tickets retrieved',
        data: tickets,
    });
});

module.exports = {
    createTicket,
    getTicketsByUser,
};
