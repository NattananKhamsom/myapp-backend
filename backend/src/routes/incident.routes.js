const express = require('express');
const { protect, requireAdmin } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const incidentController = require('../controllers/incident.controller');
const { createIncidentSchema, updateIncidentStatusSchema } = require('../validations/incident.validation');

const router = express.Router();

// Debug: ensure controller exports present (helps on case-sensitive filesystems)
try {
  const keys = Object.keys(incidentController || {});
  console.log('incident.controller exports:', keys);
  if (!incidentController || typeof incidentController.createIncident !== 'function') {
    console.error('Missing handler: incidentController.createIncident is not a function');
  }
} catch (e) {
  console.error('Error inspecting incidentController exports', e);
}

// User routes (authenticated users)
// Create incident report
router.post('/', protect, incidentController.createIncident);

// Get my incidents
router.get('/me', protect, incidentController.getMyIncidents);

// Get incident details
router.get('/:id', protect, incidentController.getIncident);

// Admin routes
// Get all incidents (admin only)
router.get('/admin/all', protect, requireAdmin, incidentController.getAllIncidents);

// Update incident status (admin only)
router.patch('/admin/:id/status', protect, requireAdmin, incidentController.updateIncidentStatus);

// Delete incident (admin only)
router.delete('/admin/:id', protect, requireAdmin, incidentController.deleteIncident);

// Get incidents against a specific user (admin only)
router.get('/admin/user/:userId', protect, requireAdmin, incidentController.getIncidentsAgainstUser);

module.exports = router;
