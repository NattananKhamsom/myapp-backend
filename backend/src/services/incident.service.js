const prisma = require('../utils/prisma');
const ApiError = require('../utils/ApiError');

// Create a new incident report
const createIncident = async (reporterId, data) => {
  const incident = await prisma.incident.create({
    data: {
      reporterId,
      reportedUserId: data.reportedUserId || null,
      type: data.type,
      title: data.title,
      description: data.description,
      attachmentUrl: data.attachmentUrl || null,
      status: 'PENDING',
    },
    include: {
      reporter: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      reportedUser: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  return incident;
};

// Get incident by ID
const getIncidentById = async (id) => {
  const incident = await prisma.incident.findUnique({
    where: { id },
    include: {
      reporter: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      reportedUser: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!incident) {
    throw new ApiError(404, 'Incident not found');
  }

  return incident;
};

// Get incidents reported by a user (user view)
const getMyIncidents = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [incidents, total] = await Promise.all([
    prisma.incident.findMany({
      where: {
        reporterId: userId,
      },
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
        reportedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.incident.count({
      where: {
        reporterId: userId,
      },
    }),
  ]);

  return {
    data: incidents,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get all incidents for admin
const getAllIncidents = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const where = {};

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.type) {
    where.type = filters.type;
  }

  const [incidents, total] = await Promise.all([
    prisma.incident.findMany({
      where,
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        reportedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.incident.count({ where }),
  ]);

  return {
    data: incidents,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Update incident status (admin only)
const updateIncidentStatus = async (id, status, adminNotes = null) => {
  const incident = await prisma.incident.findUnique({
    where: { id },
  });

  if (!incident) {
    throw new ApiError(404, 'Incident not found');
  }

  const updateData = {
    status,
    adminNotes: adminNotes || incident.adminNotes,
  };

  if (status === 'RESOLVED' && !incident.resolvedAt) {
    updateData.resolvedAt = new Date();
  }

  if (status === 'CLOSED' && !incident.closedAt) {
    updateData.closedAt = new Date();
  }

  const updated = await prisma.incident.update({
    where: { id },
    data: updateData,
    include: {
      reporter: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      reportedUser: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  return updated;
};

// Delete incident (admin only)
const deleteIncident = async (id) => {
  const incident = await prisma.incident.findUnique({
    where: { id },
  });

  if (!incident) {
    throw new ApiError(404, 'Incident not found');
  }

  await prisma.incident.delete({
    where: { id },
  });

  return { message: 'Incident deleted successfully' };
};

// Get incidents reported against a user (admin view)
const getIncidentsAgainstUser = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [incidents, total] = await Promise.all([
    prisma.incident.findMany({
      where: {
        reportedUserId: userId,
      },
      include: {
        reporter: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        reportedUser: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.incident.count({
      where: {
        reportedUserId: userId,
      },
    }),
  ]);

  return {
    data: incidents,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  createIncident,
  getIncidentById,
  getMyIncidents,
  getAllIncidents,
  updateIncidentStatus,
  deleteIncident,
  getIncidentsAgainstUser,
};
