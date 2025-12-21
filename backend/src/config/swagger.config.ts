/**
 * Swagger/OpenAPI 3.0 specification
 * Aligned to currently active routes.
 */

export const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'User Journey Analytics Platform API',
        version: '1.0.0',
        description: 'RESTful API for tracking and analyzing user behavior, events, and sessions.'
    },
    servers: [
        { url: 'http://localhost:5000', description: 'Local development server' },
        { url: 'https://9880on5vuj.execute-api.ap-south-1.amazonaws.com', description: 'AWS Lambda production server' }
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
            Error: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Unauthorized: Missing or invalid API key' }
                }
            },
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: '64cfe2c2a1b...' },
                    email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
                    name: { type: 'string', example: 'John Doe' },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            },
            Event: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: '64cfe2c2a1b...' },
                    userId: { type: 'string', example: '64cfe2c2a1b...' },
                    sessionId: { type: 'string', example: '64cfe2c2a1b...' },
                    type: {
                        type: 'string',
                        enum: ['page_view', 'purchase', 'add_to_cart', 'click', 'form_submit', 'video_play', 'error'],
                        example: 'page_view'
                    },
                    duration: { type: 'number', example: 120 },
                    purchaseCount: { type: 'number', example: 1 },
                    page: { type: 'string', example: '/products/123' },
                    itemId: { type: 'string', example: 'sku_123' },
                    timestamp: { type: 'string', format: 'date-time' },
                    metadata: { type: 'object', additionalProperties: true }
                }
            },
            Session: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: '64cfe2c2a1b...' },
                    userId: { type: 'string', example: '64cfe2c2a1b...' },
                    startedAt: { type: 'string', format: 'date-time' },
                    duration: { type: 'number', example: 600 },
                    device: { type: 'string', example: 'Desktop' },
                    location: { type: 'string', example: 'San Francisco, US' }
                }
            },
            AnalyticsSummary: {
                type: 'object',
                additionalProperties: true,
                description: 'Generic analytics response envelope'
            }
        },
        responses: {
            UnauthorizedError: {
                description: 'API key is missing or invalid',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            },
            BadRequestError: {
                description: 'Invalid request parameters',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            },
            NotFoundError: {
                description: 'Resource not found',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            }
        }
    },
    paths: {
        '/users/search/query': {
            get: {
                summary: 'Search users by query',
                tags: ['Users'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'query', name: 'query', schema: { type: 'string' }, description: 'Text match on name or email' },
                    { in: 'query', name: 'email', schema: { type: 'string', format: 'email' }, description: 'Exact or partial email' },
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1, minimum: 1 }, description: '1-based page number' },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 10, minimum: 1, maximum: 500 }, description: 'Page size (max 500)' }
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
        '/users/behavior/{userId}': {
            get: {
                summary: 'Get user behavior timeline',
                tags: ['Users'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'path', name: 'userId', required: true, schema: { type: 'string' }, description: 'User ID' },
                    { in: 'query', name: 'startDate', schema: { type: 'string', format: 'date-time' }, description: 'Inclusive start ISO date' },
                    { in: 'query', name: 'endDate', schema: { type: 'string', format: 'date-time' }, description: 'Inclusive end ISO date' }
                ],
                responses: {
                    200: {
                        description: 'User behavior data',
                        content: { 'application/json': { schema: { type: 'object', additionalProperties: true } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' },
                    404: { $ref: '#/components/responses/NotFoundError' }
                }
            }
        },
        '/events': {
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
                                required: ['userId', 'type'],
                                properties: {
                                    userId: { type: 'string' },
                                    sessionId: { type: 'string' },
                                    type: {
                                        type: 'string',
                                        enum: ['page_view', 'purchase', 'add_to_cart', 'click', 'form_submit', 'video_play', 'error']
                                    },
                                    duration: { type: 'number' },
                                    purchaseCount: { type: 'number' },
                                    page: { type: 'string' },
                                    itemId: { type: 'string' },
                                    timestamp: { type: 'string', format: 'date-time' },
                                    metadata: { type: 'object', additionalProperties: true }
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
        '/events/user/{userId}': {
            get: {
                summary: 'List events for a user',
                tags: ['Events'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'path', name: 'userId', required: true, schema: { type: 'string' }, description: 'User ID' },
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1, minimum: 1 }, description: '1-based page number' },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 50, minimum: 1, maximum: 500 }, description: 'Page size (max 500)' }
                ],
                responses: {
                    200: {
                        description: 'Events for the user',
                        content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Event' } } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' },
                    404: { $ref: '#/components/responses/NotFoundError' }
                }
            }
        },
        '/sessions/user/{userId}': {
            get: {
                summary: 'List sessions for a user',
                tags: ['Sessions'],
                security: [{ ApiKeyAuth: [] }],
                parameters: [
                    { in: 'path', name: 'userId', required: true, schema: { type: 'string' }, description: 'User ID' },
                    { in: 'query', name: 'page', schema: { type: 'integer', default: 1, minimum: 1 }, description: '1-based page number' },
                    { in: 'query', name: 'limit', schema: { type: 'integer', default: 50, minimum: 1, maximum: 500 }, description: 'Page size (max 500)' }
                ],
                responses: {
                    200: {
                        description: 'Sessions for the user',
                        content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Session' } } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' },
                    404: { $ref: '#/components/responses/NotFoundError' }
                }
            }
        },
        '/analytics/kpi': {
            get: {
                summary: 'Key performance indicators',
                tags: ['Analytics'],
                security: [{ ApiKeyAuth: [] }],
                responses: {
                    200: {
                        description: 'KPI metrics',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/AnalyticsSummary' } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' }
                }
            }
        },
        '/analytics/users': {
            get: {
                summary: 'User analytics',
                tags: ['Analytics'],
                security: [{ ApiKeyAuth: [] }],
                responses: {
                    200: {
                        description: 'User analytics data',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/AnalyticsSummary' } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' }
                }
            }
        },
        '/analytics/sessions': {
            get: {
                summary: 'Session analytics',
                tags: ['Analytics'],
                security: [{ ApiKeyAuth: [] }],
                responses: {
                    200: {
                        description: 'Session analytics data',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/AnalyticsSummary' } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' }
                }
            }
        },
        '/analytics/conversions': {
            get: {
                summary: 'Conversion metrics',
                tags: ['Analytics'],
                security: [{ ApiKeyAuth: [] }],
                responses: {
                    200: {
                        description: 'Conversion data',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/AnalyticsSummary' } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' }
                }
            }
        },
        '/analytics/top-pages': {
            get: {
                summary: 'Top pages analytics',
                tags: ['Analytics'],
                security: [{ ApiKeyAuth: [] }],
                responses: {
                    200: {
                        description: 'Top pages data',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/AnalyticsSummary' } } }
                    },
                    401: { $ref: '#/components/responses/UnauthorizedError' }
                }
            }
        },
        '/health': {
            get: {
                summary: 'Health check',
                tags: ['Health'],
                responses: {
                    200: {
                        description: 'Service is healthy',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string' },
                                        timestamp: { type: 'string', format: 'date-time' }
                                    }
                                }
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
                        content: { 'application/json': { schema: { type: 'object', additionalProperties: true } } }
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
