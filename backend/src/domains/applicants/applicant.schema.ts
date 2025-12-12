import { z } from 'zod';

export const createApplicantSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    sessionId: z.string().min(1, 'Session ID is required'),
    actionType: z.string().min(1, 'Action type is required'),
    itemId: z.string().optional(),
    status: z.string().optional(),
    timestamp: z.string().optional(),
});

export type CreateApplicantInput = z.infer<typeof createApplicantSchema>;
