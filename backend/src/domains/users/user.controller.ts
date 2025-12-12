import { Request, Response } from 'express';
import { UserService } from './user.service';
import { formattedResponse } from '../../shared/utils/response.util';
import { logger } from '../../shared/utils/logger.util';

export class UserController {
    static async getAll(req: Request, res: Response, next: Function) {
        try {
            // TBD: validation
            const users = await UserService.getAllUsers();
            logger.info('Fetched all users', { count: users.length });
            res.json(formattedResponse(users));
        } catch (err: any) {
            next(err);
        }
    }

    static async getById(req: Request, res: Response, next: Function) {
        try {
            const user = await UserService.getUserById(req.params.id);
            if (!user) {
                const err = new Error('User not found');
                (err as any).statusCode = 404;
                return next(err);
            }
            res.json(formattedResponse(user));
        } catch (err: any) {
            next(err);
        }
    }

    static async create(req: Request, res: Response, next: Function) {
        try {
            const user = await UserService.createUser(req.body);
            res.status(201).json(formattedResponse(user, 'User created'));
        } catch (err: any) {
            next(err);
        }
    }
}
