import request from 'supertest';
import app from '../app';

describe('User API', () => {
    const validApiKey = process.env.API_KEY || 'test-key';

    describe('GET /users', () => {
        it('should reject request without API key', async () => {
            const response = await request(app).get('/users');

            expect(response.status).toBe(401);
            expect(response.body.error).toContain('No API key provided');
        });

        it('should reject request with invalid API key', async () => {
            const response = await request(app)
                .get('/users')
                .set('Authorization', 'Bearer invalid-key');

            expect(response.status).toBe(403);
            expect(response.body.error).toContain('Unauthorized');
        });
    });

    describe('GET /users/search/query', () => {
        it('should require authentication', async () => {
            const response = await request(app).get('/users/search/query');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /users/:userId', () => {
        it('should require authentication', async () => {
            const response = await request(app).get('/users/507f1f77bcf86cd799439011');

            expect(response.status).toBe(401);
        });

        it('should validate userId format', async () => {
            const response = await request(app)
                .get('/users/invalid-id')
                .set('Authorization', `Bearer ${validApiKey}`);

            expect(response.status).toBe(400);
        });
    });

    describe('GET /users/analytics/:userId', () => {
        it('should require authentication', async () => {
            const response = await request(app).get('/users/analytics/507f1f77bcf86cd799439011');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /users/behavior/:userId', () => {
        it('should require authentication', async () => {
            const response = await request(app).get('/users/behavior/507f1f77bcf86cd799439011');

            expect(response.status).toBe(401);
        });
    });
});
