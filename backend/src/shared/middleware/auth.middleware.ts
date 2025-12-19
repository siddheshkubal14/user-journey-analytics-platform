import { Request, Response, NextFunction } from 'express';
import loadConfig from '../../config';

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const { auth } = loadConfig();
    const apiKey = auth?.apiKey || process.env.API_KEY;

    if (!apiKey) {
        res.status(500).json({ error: 'Server configuration error' });
        return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No API key provided' });
        return;
    }

    const token = authHeader.substring(7);
    if (token !== apiKey) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
    }

    next();
};

export default authMiddleware;