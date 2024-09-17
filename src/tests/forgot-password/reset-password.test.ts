import request from 'supertest';
import app from '../../app';

describe('POST /auth/new-password', () => {
    it('should successfully reset a registered user password', async () => {
        const response = await request(app)
            .post('/api/v1/auth/new-password')
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .send({
                newPassword: 'newPassword_43',
                confirmPassword: 'newPassword_43',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty(
            'message',
            'Password reset successfully'
        );
    });

    it('should not reset if the confirm password is different', async () => {
        const response = await request(app)
            .post('/api/v1/auth/new-password')
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .send({
                newPassword: 'newPassword_43',
                confirmPassword: 'new@Pass123',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Passwords do not match');
    });
});
