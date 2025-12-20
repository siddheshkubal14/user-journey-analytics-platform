import request from 'supertest';
import app from '../app';

describe('Event API', () => {
    const validApiKey = process.env.API_KEY || 'test-key';

    describe('POST /events', () => {
        it('should reject request without API key', async () => {
            const response = await request(app)
                .post('/events')
                .send({
                    userId: '507f1f77bcf86cd799439011',
                    type: 'page_view',
                    page: '/home'
                });

            expect(response.status).toBe(401);
            expect(response.body.error).toContain('No API key provided');
        });

        it('should reject request with invalid API key', async () => {
            const response = await request(app)
                .post('/events')
                .set('Authorization', 'Bearer invalid-key')
                .send({
                    userId: '507f1f77bcf86cd799439011',
                    type: 'page_view',
                    page: '/home'
                });

            expect(response.status).toBe(403);
            expect(response.body.error).toContain('Unauthorized');
        });

        it('should reject invalid event data', async () => {
            const response = await request(app)
                .post('/events')
                .set('Authorization', `Bearer ${validApiKey}`)
                .send({
                    type: 'page_view'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /events/user/:userId', () => {
        it('should require authentication', async () => {
            const response = await request(app)
                .get('/events/user/507f1f77bcf86cd799439011');

            expect(response.status).toBe(401);
        });

        it('should validate userId format', async () => {
            const response = await request(app)
                .get('/events/user/invalid-id')
                .set('Authorization', `Bearer ${validApiKey}`);

            expect(response.status).toBe(400);
        });
    });
});
