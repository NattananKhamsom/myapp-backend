const { z } = require('zod');

const createIncidentSchema = z.object({
  type: z.enum(['DRIVER_BEHAVIOR', 'SAFETY_ISSUE', 'VEHICLE_ISSUE', 'PASSENGER_BEHAVIOR', 'HARASSMENT', 'OTHER']),
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(2000),
  reportedUserId: z.string().optional(),
  attachmentUrl: z.string().url().optional().nullable(),
});

const updateIncidentStatusSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'RESOLVED', 'CLOSED']),
  adminNotes: z.string().max(1000).optional(),
});

const listIncidentsSchema = z.object({
  status: z.enum(['PENDING', 'REVIEWED', 'RESOLVED', 'CLOSED']).optional(),
  type: z.enum(['DRIVER_BEHAVIOR', 'SAFETY_ISSUE', 'VEHICLE_ISSUE', 'PASSENGER_BEHAVIOR', 'HARASSMENT', 'OTHER']).optional(),
  page: z.string().transform(Number).optional().default('1'),
  limit: z.string().transform(Number).optional().default('10'),
});

module.exports = {
  createIncidentSchema,
  updateIncidentStatusSchema,
  listIncidentsSchema,
};
