import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/index.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ success: false, error: 'No token provided' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
            req.user = decoded;
        }
        next();
    } catch (error) {
        next();
    }
};
