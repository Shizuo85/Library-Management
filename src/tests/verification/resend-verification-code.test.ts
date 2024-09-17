import request from 'supertest';
import app from '../../app';

describe('POST /auth/resend', () => {
    it('should resend unverifed user a verification code', async () => {
        const response = await request(app).patch('/api/v1/auth/resend').send({
            email: '',
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('token');
    });

    it('should fail if input validation fails', async () => {
        const response = await request(app).patch('/api/v1/auth/resend').send({
            email: '',
        });

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty('error');
    });

    it('should fail to resend verification code of an unknown or already verified user', async () => {
        const response = await request(app).patch('/api/v1/auth/resend').send({
            email: '',
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Invalid request');
    });
});
