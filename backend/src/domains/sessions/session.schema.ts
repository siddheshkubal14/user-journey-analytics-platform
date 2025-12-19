import { z } from 'zod';

const objectIdRegex = /^[a-f0-9]{24}$/i;

export const createSessionSchema = z.object({
    userId: z.string().regex(objectIdRegex, 'Invalid User ID format'),
    sessionStart: z.string().datetime().optional(),
    sessionEnd: z.string().datetime().optional(),
    pagesVisited: z.number().nonnegative('Pages visited cannot be negative').optional(),
    timeSpent: z.number().nonnegative('Time spent cannot be negative').optional(),
});

export const queryParamsSchema = z.object({
    page: z.string().default('1').transform(v => Math.max(1, parseInt(v, 10) || 1)),
    limit: z.string().default('50').transform(v => {
        let num = parseInt(v, 10) || 50;
        if (num < 1) num = 1;
        if (num > 500) num = 500;
        return num;
    }),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type QueryParams = z.infer<typeof queryParamsSchema>;
