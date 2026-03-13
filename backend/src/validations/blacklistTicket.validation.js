const { z } = require('zod');

const createTicketSchema = z.object({
    userId: z.string().cuid({ message: 'Invalid user ID format' }),
    cardType: z.enum(['YELLOW', 'RED'], {
        required_error: 'cardType is required',
        invalid_type_error: 'cardType must be YELLOW or RED',
    }),
    category: z.string().min(1, 'category is required'),
    reason: z.string().min(1, 'reason is required'),
});

const userIdQuerySchema = z.object({
    userId: z.string().cuid({ message: 'Invalid user ID format' }),
});

module.exports = {
    createTicketSchema,
    userIdQuerySchema,
};
