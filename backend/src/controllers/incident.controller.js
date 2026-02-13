const incidentService = require('../services/incident.service');
const ApiError = require('../utils/ApiError');
const { createIncidentSchema, updateIncidentStatusSchema, listIncidentsSchema } = require('../validations/incident.validation');

// Create a new incident report
const createIncident = async (req, res, next) => {
  try {
    const { type, title, description, reportedUserId, attachmentUrl } = req.body;
    const userId = req.user.id;

    // Validate input
    const validatedData = createIncidentSchema.parse({
      type,
      title,
      description,
      reportedUserId,
      attachmentUrl,
    });

    const incident = await incidentService.createIncident(userId, validatedData);

    res.status(201).json({
      success: true,
      message: 'Incident reported successfully',
      data: incident,
    });
  } catch (error) {
    next(error);
  }
};

// Get incident details
const getIncident = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const incident = await incidentService.getIncidentById(id);

    // Check authorization: user can only view their own incidents or incidents reported against them (unless admin)
    if (req.user.role !== 'ADMIN' && incident.reporterId !== userId && incident.reportedUserId !== userId) {
      throw new ApiError(403, 'You do not have permission to view this incident');
    }

    res.status(200).json({
      success: true,
      message: 'Incident retrieved successfully',
      data: incident,
    });
  } catch (error) {
    next(error);
  }
};

// Get my reported incidents
const getMyIncidents = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const result = await incidentService.getMyIncidents(userId, parseInt(page), parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'My incidents retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// Get all incidents (admin only)
const getAllIncidents = async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;

    // Validate query parameters
    const validatedQuery = listIncidentsSchema.parse({
      status,
      type,
      page: page.toString(),
      limit: limit.toString(),
    });

    const result = await incidentService.getAllIncidents(
      {
        status: validatedQuery.status,
        type: validatedQuery.type,
      },
      parseInt(validatedQuery.page),
      parseInt(validatedQuery.limit)
    );

    res.status(200).json({
      success: true,
      message: 'All incidents retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// Update incident status (admin only)
const updateIncidentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    // Validate input
    const validatedData = updateIncidentStatusSchema.parse({
      status,
      adminNotes,
    });

    const updated = await incidentService.updateIncidentStatus(
      id,
      validatedData.status,
      validatedData.adminNotes
    );

    res.status(200).json({
      success: true,
      message: 'Incident status updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// Delete incident (admin only)
const deleteIncident = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await incidentService.deleteIncident(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

// Get incidents reported against a user (admin only)
const getIncidentsAgainstUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await incidentService.getIncidentsAgainstUser(userId, parseInt(page), parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Incidents against user retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createIncident,
  getIncident,
  getMyIncidents,
  getAllIncidents,
  updateIncidentStatus,
  deleteIncident,
  getIncidentsAgainstUser,
};
