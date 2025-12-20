/**
 * Swagger/OpenAPI 3.0 Configuration
 * Complete API specification without JSDoc dependencies
 */

export const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'User Journey Analytics Platform API',
        version: '1.0.0',
        description: 'RESTful API for tracking and analyzing user behavior, events, and sessions.'
    },
    servers: [
        {
            url: 'http://localhost:5000',
            description: 'Local development server'
        },
        {
            url: 'https://9880on5vuj.execute-api.ap-south-1.amazonaws.com',
            description: 'AWS Lambda production server'
        }
    ],
    components: {
        securitySchemes: {
            ApiKeyAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: 'API Key authentication. Use format: Bearer YOUR_API_KEY'
            }
        },
        schemas: {
            User: {
                type: 'object',
                required: ['userId', 'email'],
                properties: {
                    userId: { type: 'string', example: 'user_12345' },
                    email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
                    name: { type: 'string', example: 'John Doe' },
                    metadata: { type: 'object', additionalProperties: true },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            },
            Event: {
                type: 'object',
                required: ['userId', 'eventType', 'timestamp'],
                properties: {
                    eventId: { type: 'string' },
                    userId: { type: 'string', example: 'user_12345' },
                    sessionId: { type: 'string', example: 'sess_abc123' },
                    eventType: { type: 'string', example: 'page_view' },
                    timestamp: { type: 'string', format: 'date-time' },
                    payload: { type: 'object', additionalProperties: true }
                }
            },
            Session: {
                type: 'object',
                required: ['userId', 'sessionId'],
                properties: {
                    sessionId: { type: 'string', example: 'sess_abc123' },
                    userId: { type: 'string', example: 'user_12345' },
                    startTime: { type: 'string', format: 'date-time' },
                    endTime: { type: 'string', format: 'date-time' },
                    duration: { type: 'number', example: 1234 },
                    eventCount: { type: 'number', example: 15 },
                    metadata: { type: 'object', additionalProperties: true }
                }
            },
            Error: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Error message' }
                }
            }
        },
        responses: {
            UnauthorizedError: {
                description: 'API key is missing or invalid',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' },
                        example: { success: false, error: 'Unauthorized: Missing or invalid API key' }
                    }
                }
            },
            BadRequestError: {
                description: 'Invalid request parameters',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' },
                        example: { success: false, error: 'Validation failed: userId is required' }
                    }
                }
            },
            NotFoundError: {
                description: 'Resource not found',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' },
                        example: { success: false, error: 'Resource not found' }
                    }
                }
            },
            ServerError: {
                description: 'Internal server error',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' },
                        example: { success: false, error: 'Internal server error' }
                    }
                }
            }
        }
    },
    security: [{ ApiKeyAuth: [] }],
    paths: {
        '/users': {
            get: {
                summary: 'Get all users',
                tags: ['Users'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 }, description: 'Page number' },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 }, description: 'Items per page' }
                ],
                responses: {
                    200: {
                        description: 'List of all users',
                        content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' }
                }
            },
            post: {
                summary: 'Create a new user',
                tags: ['Users'],
                security: [{ ApiKeyAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['userId', 'email'],
                                properties: {
                                    userId: { type: 'string', example: 'user_12345' },
                                    email: { type: 'string', format: 'email', example: 'john@example.com' },
                                    name: { type: 'string', example: 'John Doe' },
                                    metadata: { type: 'object' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'User created',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } }
                    },
                    400: { $ref: '#/components/responses/BadRequestError' },
                    401: { $ref: '#/components/responses/UnauthorizedError' }
                }
            }
        },
        '/users/{id}': {
            get: {
                summary: 'Get user by ID',
                tags: ['Users'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'User ID' }
                ],
                responses: {
                    200: {
                        description: 'User details',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' },
                    404: { $ref: '#/components/responses/NotFoundError' }
                }
            }
        },
        '/users/search/query': {
            get: {
                summary: 'Search users by query',
                tags: ['Users'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'query', name: 'email', schema: { type: 'string' }, description: 'Filter by email' },
                    { in: 'query', name: 'name', schema: { type: 'string' }, description: 'Filter by name' },
                    { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date-time' } },
                    { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date-time' } }
                ],
                responses: {
                    200: {
                        description: 'Matching users',
                        content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' }
                }
            }
        },
        '/users/analytics/{userId}': {
            get: {
                summary: 'Get user analytics',
                tags: ['Users'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'path', name: 'userId', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    200: {
                        description: 'User analytics data',
                        content: { 'application/json': { schema: { type: 'object' } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' },
                    404: { $ref: '#/components/responses/NotFoundError' }
                }
            }
        },
        '/users/behavior/{userId}': {
            get: {
                summary: 'Get user behavior timeline',
                tags: ['Users'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'path', name: 'userId', required: true, schema: { type: 'string' } },
                    { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date-time' } },
                    { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date-time' } }
                ],
                responses: {
                    200: {
                        description: 'User behavior data',
                        content: { 'application/json': { schema: { type: 'object' } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' },
                    404: { $ref: '#/components/responses/NotFoundError' }
                }
            }
        },
        '/events': {
            get: {
                summary: 'Get all events',
                tags: ['Events'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 50 } },
                    { in: 'query', name: 'eventType', schema: { type: 'string' } }
                ],
                responses: {
                    200: {
                        description: 'List of events',
                        content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Event' } } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' }
                }
            },
            post: {
                summary: 'Create a new event',
                tags: ['Events'],
                security: [{ ApiKeyAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['userId', 'eventType', 'timestamp'],
                                properties: {
                                    userId: { type: 'string' },
                                    sessionId: { type: 'string' },
                                    eventType: { type: 'string' },
                                    timestamp: { type: 'string', format: 'date-time' },
                                    payload: { type: 'object' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Event created',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/Event' } } }
                    },
                    400: { $ref: '#/components/responses/BadRequestError' },
                    401: { $ref: '#/components/responses/UnauthorizedError' }
                }
            }
        },
        '/events/{id}': {
            get: {
                summary: 'Get event by ID',
                tags: ['Events'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    200: {
                        description: 'Event details',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/Event' } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' },
                    404: { $ref: '#/components/responses/NotFoundError' }
                }
            }
        },
        '/events/user/{userId}': {
            get: {
                summary: 'Get events by user',
                tags: ['Events'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'path', name: 'userId', required: true, schema: { type: 'string' } },
                    { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date-time' } },
                    { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date-time' } }
                ],
                responses: {
                    200: {
                        description: 'User events',
                        content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Event' } } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' },
                    404: { $ref: '#/components/responses/NotFoundError' }
                }
            }
        },
        '/events/session/{sessionId}': {
            get: {
                summary: 'Get events by session',
                tags: ['Events'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'path', name: 'sessionId', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    200: {
                        description: 'Session events',
                        content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Event' } } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' },
                    404: { $ref: '#/components/responses/NotFoundError' }
                }
            }
        },
        '/sessions': {
            get: {
                summary: 'Get all sessions',
                tags: ['Sessions'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } }
                ],
                responses: {
                    200: {
                        description: 'List of sessions',
                        content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Session' } } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' }
                }
            },
            post: {
                summary: 'Create a new session',
                tags: ['Sessions'],
                security: [{ ApiKeyAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['userId', 'sessionId'],
                                properties: {
                                    userId: { type: 'string' },
                                    sessionId: { type: 'string' },
                                    startTime: { type: 'string', format: 'date-time' },
                                    endTime: { type: 'string', format: 'date-time' },
                                    metadata: { type: 'object' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Session created',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/Session' } } }
                    },
                    400: { $ref: '#/components/responses/BadRequestError' },
                    401: { $ref: '#/components/responses/UnauthorizedError' }
                }
            }
        },
        '/sessions/{id}': {
            get: {
                summary: 'Get session by ID',
                tags: ['Sessions'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'path', name: 'id', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    200: {
                        description: 'Session details',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/Session' } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' },
                    404: { $ref: '#/components/responses/NotFoundError' }
                }
            }
        },
        '/sessions/user/{userId}': {
            get: {
                summary: 'Get sessions by user',
                tags: ['Sessions'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'path', name: 'userId', required: true, schema: { type: 'string' } },
                    { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date-time' } },
                    { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date-time' } }
                ],
                responses: {
                    200: {
                        description: 'User sessions',
                        content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Session' } } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' },
                    404: { $ref: '#/components/responses/NotFoundError' }
                }
            }
        },
        '/analytics/kpi': {
            get: {
                summary: 'Get KPI metrics',
                tags: ['Analytics'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date-time' } },
                    { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date-time' } }
                ],
                responses: {
                    200: {
                        description: 'KPI metrics',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        totalUsers: { type: 'number' },
                                        totalEvents: { type: 'number' },
                                        totalSessions: { type: 'number' },
                                        avgSessionDuration: { type: 'number' }
                                    }
                                }
                            }
                        }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' }
                }
            }
        },
        '/analytics/users': {
            get: {
                summary: 'Get user analytics metrics',
                tags: ['Analytics'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date-time' } },
                    { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date-time' } },
                    { in: 'query', name: 'groupBy', schema: { type: 'string', enum: ['day', 'week', 'month'] } }
                ],
                responses: {
                    200: {
                        description: 'User analytics',
                        content: { 'application/json': { schema: { type: 'object' } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' }
                }
            }
        },
        '/analytics/sessions': {
            get: {
                summary: 'Get session analytics metrics',
                tags: ['Analytics'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date-time' } },
                    { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date-time' } }
                ],
                responses: {
                    200: {
                        description: 'Session analytics',
                        content: { 'application/json': { schema: { type: 'object' } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' }
                }
            }
        },
        '/analytics/conversions': {
            get: {
                summary: 'Get conversion metrics',
                tags: ['Analytics'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'query', name: 'eventType', schema: { type: 'string' } },
                    { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date-time' } },
                    { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date-time' } }
                ],
                responses: {
                    200: {
                        description: 'Conversion metrics',
                        content: { 'application/json': { schema: { type: 'object' } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' }
                }
            }
        },
        '/analytics/top-pages': {
            get: {
                summary: 'Get top visited pages',
                tags: ['Analytics'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 10 } },
                    { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date-time' } },
                    { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date-time' } }
                ],
                responses: {
                    200: {
                        description: 'Top pages',
                        content: { 'application/json': { schema: { type: 'array', items: { type: 'object' } } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' }
                }
            }
        },
        '/health': {
            get: {
                summary: 'Get basic health status',
                tags: ['Health'],
                responses: {
                    200: {
                        description: 'Service is healthy',
                        content: {
                            'application/json': {
                                schema: { type: 'object', properties: { status: { type: 'string' }, timestamp: { type: 'string', format: 'date-time' } } }
                            }
                        }
                    }
                }
            }
        },
        '/metrics': {
            get: {
                summary: 'Get system metrics',
                tags: ['Health'],
                security: [{ ApiKeyAuth: [] }],
                responses: {
                    200: {
                        description: 'System metrics',
                        content: { 'application/json': { schema: { type: 'object' } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' }
                }
            }
        },
        '/live': {
            get: {
                summary: 'Liveness probe',
                tags: ['Health'],
                responses: {
                    200: {
                        description: 'Service is alive',
                        content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' } } } } }
                    }
                }
            }
        },
        '/ready': {
            get: {
                summary: 'Readiness probe',
                tags: ['Health'],
                responses: {
                    200: {
                        description: 'Service is ready',
                        content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, database: { type: 'string' } } } } }
                    },
                    503: { description: 'Service not ready' }
                }
            }
        }
    }
};
