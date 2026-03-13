const express = require('express');
const controller = require('../controllers/blacklistTicket.controller');
const validate = require('../middlewares/validate');
const { createTicketSchema, userIdQuerySchema } = require('../validations/blacklistTicket.validation');
const { protect, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

// POST /api/blacklist-tickets  — create a yellow/red card
router.post(
    '/',
    protect,
    requireAdmin,
    validate({ body: createTicketSchema }),
    controller.createTicket
);

// GET /api/blacklist-tickets?userId=xxx  — list tickets for a user
router.get(
    '/',
    protect,
    requireAdmin,
    validate({ query: userIdQuerySchema }),
    controller.getTicketsByUser
);

module.exports = router;
