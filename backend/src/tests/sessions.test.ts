import request from 'supertest';
import app from '../app';

describe('Session API', () => {
    const validApiKey = process.env.API_KEY || 'test-key';

    describe('GET /sessions/user/:userId', () => {
        it('should reject request without API key', async () => {
            const response = await request(app)
                .get('/sessions/user/507f1f77bcf86cd799439011');

            expect(response.status).toBe(401);
            expect(response.body.error).toContain('No API key provided');
        });

        it('should reject request with invalid API key', async () => {
            const response = await request(app)
                .get('/sessions/user/507f1f77bcf86cd799439011')
                .set('Authorization', 'Bearer invalid-key');

            expect(response.status).toBe(403);
            expect(response.body.error).toContain('Unauthorized');
        });

        it('should validate userId format', async () => {
            const response = await request(app)
                .get('/sessions/user/invalid-id')
                .set('Authorization', `Bearer ${validApiKey}`);

            expect(response.status).toBe(400);
        });
    });
});
