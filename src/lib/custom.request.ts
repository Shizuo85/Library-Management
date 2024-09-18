import { Request } from 'express';

export default interface CustomRequest extends Request {
    user?: string;
    role?: string;
    temp_email?: any;
    email?: string
};