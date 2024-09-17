import request from 'supertest';
import app from '../../app';

describe('POST /auth/verify', () => {
    it('should fail to verify an unverifed user if jwt is not provided', async () => {
        const response = await request(app).patch('/api/v1/auth/verify').send({
            code: '',
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            'error',
            'Bad request, token missing'
        );
    });

    it('should fail to verify an unverifed user if token is invalid or expired', async () => {
        const response = await request(app)
            .patch('/api/v1/auth/verify')
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .send({
                code: '123456',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            'error',
            'Invalid or expired token'
        );
    });

    it('should verify an unverifed user', async () => {
        const response = await request(app)
            .patch('/api/v1/auth/verify')
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .send({
                code: '527408',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('access_token');
        expect(response.body.data).toHaveProperty('refresh_token');
    });

    it('should fail to verify if wrong but vaild jwt is passed', async () => {
        const response = await request(app)
            .patch('/api/v1/auth/verify')
            .set('Authorization', `Bearer ${process.env.WRONG_TOKEN}`)
            .send({
                code: '527408',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            'error',
            'Bad request, invalid token'
        );
    });

    it('should fail to verify if an invalid jwt is passed', async () => {
        const response = await request(app)
            .patch('/api/v1/auth/verify')
            .set('Authorization', `Bearer XYZ`)
            .send({
                code: '527408',
            });

        expect([401, 400]).toContain(response.status);
        expect(response.body).toHaveProperty('error');
    });

    it('should fail to verify if input validation fails', async () => {
        const response = await request(app)
            .patch('/api/v1/auth/verify')
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .send({
                code: '',
            });

        expect(response.status).toBe(422);
        expect(response.body).toHaveProperty('error');
    });

    it('should fail to verify an already verified account', async () => {
        const response = await request(app)
            .patch('/api/v1/auth/verify')
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .send({
                code: '527408',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            'error',
            'Account has been verified already'
        );
    });
});
