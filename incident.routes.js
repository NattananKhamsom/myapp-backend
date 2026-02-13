const express = require('express');
const { auth } = require('../middlewares/auth');
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
router.post('/', auth, incidentController.createIncident);

// Get my incidents
router.get('/me', auth, incidentController.getMyIncidents);

// Get incident details
router.get('/:id', auth, incidentController.getIncident);

// Admin routes
// Get all incidents (admin only)
router.get('/admin/all', auth, (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
}, incidentController.getAllIncidents);

// Update incident status (admin only)
router.patch('/admin/:id/status', auth, (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
}, incidentController.updateIncidentStatus);

// Delete incident (admin only)
router.delete('/admin/:id', auth, (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
}, incidentController.deleteIncident);

// Get incidents against a specific user (admin only)
router.get('/admin/user/:userId', auth, (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
}, incidentController.getIncidentsAgainstUser);

module.exports = router;
