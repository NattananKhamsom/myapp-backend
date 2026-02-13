/**
 * @swagger
 * tags:
 *   name: Incidents
 *   description: Incident reporting and management endpoints
 */

/**
 * @swagger
 * /api/incidents:
 *   post:
 *     summary: Report an incident
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - title
 *               - description
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [DRIVER_BEHAVIOR, SAFETY_ISSUE, VEHICLE_ISSUE, PASSENGER_BEHAVIOR, HARASSMENT, OTHER]
 *                 example: DRIVER_BEHAVIOR
 *               title:
 *                 type: string
 *                 example: Unsafe driving behavior
 *               description:
 *                 type: string
 *                 example: Driver was speeding and made sudden turns without signaling
 *               reportedUserId:
 *                 type: string
 *                 example: user123
 *               attachmentUrl:
 *                 type: string
 *                 format: url
 *                 example: https://example.com/photo.jpg
 *     responses:
 *       201:
 *         description: Incident reported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/incidents/me:
 *   get:
 *     summary: Get my reported incidents
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Incidents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                 pagination:
 *                   type: object
 */

/**
 * @swagger
 * /api/incidents/{id}:
 *   get:
 *     summary: Get incident details
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Incident retrieved successfully
 *       404:
 *         description: Incident not found
 *       403:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /api/incidents/admin/all:
 *   get:
 *     summary: Get all incidents (Admin only)
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [PENDING, REVIEWED, RESOLVED, CLOSED]
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *           enum: [DRIVER_BEHAVIOR, SAFETY_ISSUE, VEHICLE_ISSUE, PASSENGER_BEHAVIOR, HARASSMENT, OTHER]
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: All incidents retrieved successfully
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/incidents/admin/{id}/status:
 *   patch:
 *     summary: Update incident status (Admin only)
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, REVIEWED, RESOLVED, CLOSED]
 *               adminNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Incident not found
 */

/**
 * @swagger
 * /api/incidents/admin/{id}:
 *   delete:
 *     summary: Delete incident (Admin only)
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Incident deleted successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Incident not found
 */

/**
 * @swagger
 * /api/incidents/admin/user/{userId}:
 *   get:
 *     summary: Get incidents against a specific user (Admin only)
 *     tags: [Incidents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Incidents against user retrieved successfully
 *       403:
 *         description: Admin access required
 */

module.exports = {};
