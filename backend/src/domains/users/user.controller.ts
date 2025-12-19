import { Request, Response } from 'express';
import { UserService } from './user.service';
import { createUserSchema, searchUserSchema } from './user.schema';
import { formattedResponse } from '../../shared/utils/response.util';
import { logger } from '../../shared/utils/logger.util';

export class UserController {
    static async getAll(req: Request, res: Response, next: Function) {
        try {
            const users = await UserService.getAllUsers();
            logger.info('Fetched all users', { count: users.length });
            res.json(formattedResponse(users, 'Users retrieved successfully'));
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
            res.json(formattedResponse(user, 'User retrieved successfully'));
        } catch (err: any) {
            (err as any).statusCode = 400;
            next(err);
        }
    }

    static async create(req: Request, res: Response, next: Function) {
        try {
            const validated = createUserSchema.parse(req.body);
            const user = await UserService.createUser(validated);
            res.status(201).json(formattedResponse(user, 'User created successfully'));
        } catch (err: any) {
            (err as any).statusCode = 400;
            next(err);
        }
    }

    static async searchUsers(req: Request, res: Response, next: Function) {
        try {
            const params = searchUserSchema.parse(req.query);
            logger.info('Searching users', { query: params.query, email: params.email });
            const results = await UserService.searchUsers(params);
            res.json(formattedResponse(results, 'Users search completed'));
        } catch (err: any) {
            (err as any).statusCode = 400;
            next(err);
        }
    }

    static async getUserAnalytics(req: Request, res: Response, next: Function) {
        try {
            logger.info('Fetching user analytics', { userId: req.params.userId });
            const analytics = await UserService.getUserAnalytics(req.params.userId);
            if (!analytics) {
                const err = new Error('User analytics not found');
                (err as any).statusCode = 404;
                return next(err);
            }
            res.json(formattedResponse(analytics, 'User analytics retrieved'));
        } catch (err: any) {
            (err as any).statusCode = 400;
            next(err);
        }
    }

    static async getUserBehavior(req: Request, res: Response, next: Function) {
        try {
            const { startDate, endDate } = req.query;
            logger.info('Fetching user behavior', { userId: req.params.userId, startDate, endDate });
            const behavior = await UserService.getUserBehavior(
                req.params.userId,
                startDate as string,
                endDate as string
            );
            if (!behavior) {
                const err = new Error('User behavior data not found');
                (err as any).statusCode = 404;
                return next(err);
            }
            res.json(formattedResponse(behavior, 'User behavior retrieved'));
        } catch (err: any) {
            (err as any).statusCode = 400;
            next(err);
        }
    }
}
