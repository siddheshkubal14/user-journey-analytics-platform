/**
 * Central Swagger/OpenAPI endpoint definitions for all domains
 * This file contains all endpoint documentation in one place
 */

export const swaggerEndpoints = {
    // ============ Users Domain ============
    userSearch: {
        path: '/users/search/query',
        method: 'get',
        summary: 'Search users by query parameters',
        tags: ['Users'],
        security: true,
        parameters: [
            {
                in: 'query',
                name: 'email',
                schema: { type: 'string' },
                description: 'Filter by email address'
            },
            {
                in: 'query',
                name: 'name',
                schema: { type: 'string' },
                description: 'Filter by user name'
            },
            {
                in: 'query',
                name: 'startDate',
                schema: { type: 'string', format: 'date-time' },
                description: 'Filter users created after this date'
            },
            {
                in: 'query',
                name: 'endDate',
                schema: { type: 'string', format: 'date-time' },
                description: 'Filter users created before this date'
            }
        ],
        responses: {
            200: {
                description: 'List of matching users',
                schema: 'ArrayUser'
            },
            401: 'UnauthorizedError',
            500: 'ServerError'
        }
    },

    userAnalytics: {
        path: '/users/analytics/{userId}',
        method: 'get',
        summary: 'Get analytics for a specific user',
        tags: ['Users'],
        security: true,
        parameters: [
            {
                in: 'path',
                name: 'userId',
                required: true,
                schema: { type: 'string' },
                description: 'User ID'
            }
        ],
        responses: {
            200: {
                description: 'User analytics data',
                schema: 'UserAnalytics'
            },
            401: 'UnauthorizedError',
            404: 'NotFoundError'
        }
    },

    userBehavior: {
        path: '/users/behavior/{userId}',
        method: 'get',
        summary: 'Get behavior timeline for a specific user',
        tags: ['Users'],
        security: true,
        parameters: [
            {
                in: 'path',
                name: 'userId',
                required: true,
                schema: { type: 'string' },
                description: 'User ID'
            },
            {
                in: 'query',
                name: 'startDate',
                schema: { type: 'string', format: 'date-time' },
                description: 'Filter events after this date'
            },
            {
                in: 'query',
                name: 'endDate',
                schema: { type: 'string', format: 'date-time' },
                description: 'Filter events before this date'
            }
        ],
        responses: {
            200: {
                description: 'User behavior timeline',
                schema: 'UserBehavior'
            },
            401: 'UnauthorizedError',
            404: 'NotFoundError'
        }
    },

    getAllUsers: {
        path: '/users',
        method: 'get',
        summary: 'Get all users',
        tags: ['Users'],
        security: true,
        parameters: [
            {
                in: 'query',
                name: 'page',
                schema: { type: 'integer', default: 1 },
                description: 'Page number for pagination'
            },
            {
                in: 'query',
                name: 'limit',
                schema: { type: 'integer', default: 20 },
                description: 'Number of items per page'
            }
        ],
        responses: {
            200: {
                description: 'List of all users',
                schema: 'ArrayUser'
            },
            401: 'UnauthorizedError'
        }
    },

    createUser: {
        path: '/users',
        method: 'post',
        summary: 'Create a new user',
        tags: ['Users'],
        security: true,
        requestBody: {
            required: true,
            schema: 'UserCreate'
        },
        responses: {
            201: {
                description: 'User created successfully',
                schema: 'User'
            },
            400: 'BadRequestError',
            401: 'UnauthorizedError'
        }
    },

    getUserById: {
        path: '/users/{id}',
        method: 'get',
        summary: 'Get user by ID',
        tags: ['Users'],
        security: true,
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'string' },
                description: 'User ID'
            }
        ],
        responses: {
            200: {
                description: 'User details',
                schema: 'User'
            },
            401: 'UnauthorizedError',
            404: 'NotFoundError'
        }
    },

    // ============ Events Domain ============
    getAllEvents: {
        path: '/events',
        method: 'get',
        summary: 'Get all events',
        tags: ['Events'],
        security: true,
        parameters: [
            {
                in: 'query',
                name: 'page',
                schema: { type: 'integer', default: 1 },
                description: 'Page number for pagination'
            },
            {
                in: 'query',
                name: 'limit',
                schema: { type: 'integer', default: 50 },
                description: 'Number of items per page'
            },
            {
                in: 'query',
                name: 'eventType',
                schema: { type: 'string' },
                description: 'Filter by event type'
            }
        ],
        responses: {
            200: {
                description: 'List of all events',
                schema: 'ArrayEvent'
            },
            401: 'UnauthorizedError'
        }
    },

    createEvent: {
        path: '/events',
        method: 'post',
        summary: 'Create a new event',
        tags: ['Events'],
        security: true,
        requestBody: {
            required: true,
            schema: 'EventCreate'
        },
        responses: {
            201: {
                description: 'Event created successfully',
                schema: 'Event'
            },
            400: 'BadRequestError',
            401: 'UnauthorizedError'
        }
    },

    getEventById: {
        path: '/events/{id}',
        method: 'get',
        summary: 'Get event by ID',
        tags: ['Events'],
        security: true,
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'string' },
                description: 'Event ID'
            }
        ],
        responses: {
            200: {
                description: 'Event details',
                schema: 'Event'
            },
            401: 'UnauthorizedError',
            404: 'NotFoundError'
        }
    },

    getEventsByUser: {
        path: '/events/user/{userId}',
        method: 'get',
        summary: 'Get all events for a specific user',
        tags: ['Events'],
        security: true,
        parameters: [
            {
                in: 'path',
                name: 'userId',
                required: true,
                schema: { type: 'string' },
                description: 'User ID'
            },
            {
                in: 'query',
                name: 'startDate',
                schema: { type: 'string', format: 'date-time' },
                description: 'Filter events after this date'
            },
            {
                in: 'query',
                name: 'endDate',
                schema: { type: 'string', format: 'date-time' },
                description: 'Filter events before this date'
            }
        ],
        responses: {
            200: {
                description: 'List of user events',
                schema: 'ArrayEvent'
            },
            401: 'UnauthorizedError',
            404: 'NotFoundError'
        }
    },

    getEventsBySession: {
        path: '/events/session/{sessionId}',
        method: 'get',
        summary: 'Get all events for a specific session',
        tags: ['Events'],
        security: true,
        parameters: [
            {
                in: 'path',
                name: 'sessionId',
                required: true,
                schema: { type: 'string' },
                description: 'Session ID'
            }
        ],
        responses: {
            200: {
                description: 'List of session events',
                schema: 'ArrayEvent'
            },
            401: 'UnauthorizedError',
            404: 'NotFoundError'
        }
    },

    // ============ Sessions Domain ============
    getAllSessions: {
        path: '/sessions',
        method: 'get',
        summary: 'Get all sessions',
        tags: ['Sessions'],
        security: true,
        parameters: [
            {
                in: 'query',
                name: 'page',
                schema: { type: 'integer', default: 1 },
                description: 'Page number for pagination'
            },
            {
                in: 'query',
                name: 'limit',
                schema: { type: 'integer', default: 20 },
                description: 'Number of items per page'
            }
        ],
        responses: {
            200: {
                description: 'List of all sessions',
                schema: 'ArraySession'
            },
            401: 'UnauthorizedError'
        }
    },

    createSession: {
        path: '/sessions',
        method: 'post',
        summary: 'Create a new session',
        tags: ['Sessions'],
        security: true,
        requestBody: {
            required: true,
            schema: 'SessionCreate'
        },
        responses: {
            201: {
                description: 'Session created successfully',
                schema: 'Session'
            },
            400: 'BadRequestError',
            401: 'UnauthorizedError'
        }
    },

    getSessionById: {
        path: '/sessions/{id}',
        method: 'get',
        summary: 'Get session by ID',
        tags: ['Sessions'],
        security: true,
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'string' },
                description: 'Session ID'
            }
        ],
        responses: {
            200: {
                description: 'Session details',
                schema: 'Session'
            },
            401: 'UnauthorizedError',
            404: 'NotFoundError'
        }
    },

    getSessionsByUser: {
        path: '/sessions/user/{userId}',
        method: 'get',
        summary: 'Get all sessions for a specific user',
        tags: ['Sessions'],
        security: true,
        parameters: [
            {
                in: 'path',
                name: 'userId',
                required: true,
                schema: { type: 'string' },
                description: 'User ID'
            },
            {
                in: 'query',
                name: 'startDate',
                schema: { type: 'string', format: 'date-time' },
                description: 'Filter sessions after this date'
            },
            {
                in: 'query',
                name: 'endDate',
                schema: { type: 'string', format: 'date-time' },
                description: 'Filter sessions before this date'
            }
        ],
        responses: {
            200: {
                description: 'List of user sessions',
                schema: 'ArraySession'
            },
            401: 'UnauthorizedError',
            404: 'NotFoundError'
        }
    },

    // ============ Analytics Domain ============
    getKPIs: {
        path: '/analytics/kpi',
        method: 'get',
        summary: 'Get key performance indicators (KPIs)',
        tags: ['Analytics'],
        security: true,
        parameters: [
            {
                in: 'query',
                name: 'startDate',
                schema: { type: 'string', format: 'date-time' },
                description: 'Start date for KPI calculation'
            },
            {
                in: 'query',
                name: 'endDate',
                schema: { type: 'string', format: 'date-time' },
                description: 'End date for KPI calculation'
            }
        ],
        responses: {
            200: {
                description: 'KPI metrics',
                schema: 'KPI'
            },
            401: 'UnauthorizedError'
        }
    },

    getUserAnalyticsMetrics: {
        path: '/analytics/users',
        method: 'get',
        summary: 'Get user analytics metrics',
        tags: ['Analytics'],
        security: true,
        parameters: [
            {
                in: 'query',
                name: 'startDate',
                schema: { type: 'string', format: 'date-time' },
                description: 'Start date'
            },
            {
                in: 'query',
                name: 'endDate',
                schema: { type: 'string', format: 'date-time' },
                description: 'End date'
            },
            {
                in: 'query',
                name: 'groupBy',
                schema: { type: 'string', enum: ['day', 'week', 'month'] },
                description: 'Group results by time period'
            }
        ],
        responses: {
            200: {
                description: 'User analytics data',
                schema: 'UserAnalyticsMetrics'
            },
            401: 'UnauthorizedError'
        }
    },

    getSessionAnalyticsMetrics: {
        path: '/analytics/sessions',
        method: 'get',
        summary: 'Get session analytics metrics',
        tags: ['Analytics'],
        security: true,
        parameters: [
            {
                in: 'query',
                name: 'startDate',
                schema: { type: 'string', format: 'date-time' },
                description: 'Start date'
            },
            {
                in: 'query',
                name: 'endDate',
                schema: { type: 'string', format: 'date-time' },
                description: 'End date'
            }
        ],
        responses: {
            200: {
                description: 'Session analytics data',
                schema: 'SessionAnalyticsMetrics'
            },
            401: 'UnauthorizedError'
        }
    },

    getConversionMetrics: {
        path: '/analytics/conversions',
        method: 'get',
        summary: 'Get conversion metrics',
        tags: ['Analytics'],
        security: true,
        parameters: [
            {
                in: 'query',
                name: 'eventType',
                schema: { type: 'string' },
                description: 'Filter by specific conversion event type'
            },
            {
                in: 'query',
                name: 'startDate',
                schema: { type: 'string', format: 'date-time' },
                description: 'Start date'
            },
            {
                in: 'query',
                name: 'endDate',
                schema: { type: 'string', format: 'date-time' },
                description: 'End date'
            }
        ],
        responses: {
            200: {
                description: 'Conversion metrics',
                schema: 'ConversionMetrics'
            },
            401: 'UnauthorizedError'
        }
    },

    getTopPages: {
        path: '/analytics/top-pages',
        method: 'get',
        summary: 'Get top visited pages',
        tags: ['Analytics'],
        security: true,
        parameters: [
            {
                in: 'query',
                name: 'limit',
                schema: { type: 'integer', default: 10 },
                description: 'Number of top pages to return'
            },
            {
                in: 'query',
                name: 'startDate',
                schema: { type: 'string', format: 'date-time' },
                description: 'Start date'
            },
            {
                in: 'query',
                name: 'endDate',
                schema: { type: 'string', format: 'date-time' },
                description: 'End date'
            }
        ],
        responses: {
            200: {
                description: 'List of top pages',
                schema: 'ArrayTopPages'
            },
            401: 'UnauthorizedError'
        }
    },

    // ============ Health Domain ============
    getHealth: {
        path: '/health',
        method: 'get',
        summary: 'Get basic health status',
        tags: ['Health'],
        security: false,
        responses: {
            200: {
                description: 'Service is healthy',
                schema: 'HealthStatus'
            }
        }
    },

    getMetrics: {
        path: '/metrics',
        method: 'get',
        summary: 'Get detailed system metrics',
        tags: ['Health'],
        security: true,
        responses: {
            200: {
                description: 'System metrics',
                schema: 'SystemMetrics'
            },
            401: 'UnauthorizedError'
        }
    },

    getLiveness: {
        path: '/live',
        method: 'get',
        summary: 'Liveness probe for Kubernetes/container orchestration',
        tags: ['Health'],
        security: false,
        responses: {
            200: {
                description: 'Service is alive',
                schema: 'LivenessStatus'
            }
        }
    },

    getReadiness: {
        path: '/ready',
        method: 'get',
        summary: 'Readiness probe for Kubernetes/container orchestration',
        tags: ['Health'],
        security: false,
        responses: {
            200: {
                description: 'Service is ready to accept traffic',
                schema: 'ReadinessStatus'
            },
            503: {
                description: 'Service is not ready',
                schema: 'ReadinessStatus'
            }
        }
    }
};
