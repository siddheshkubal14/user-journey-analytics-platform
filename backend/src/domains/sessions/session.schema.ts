import { z } from 'zod';

export const createSessionSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    sessionStart: z.string().optional(), // ISO date string
    sessionEnd: z.string().optional(),
    pagesVisited: z.number().optional(),
    timeSpent: z.number().optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
