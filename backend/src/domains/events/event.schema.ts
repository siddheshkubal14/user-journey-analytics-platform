import { z } from 'zod';

export const createEventSchema = z.object({
    sessionId: z.string().min(1, 'Session ID is required'),
    userId: z.string().min(1, 'User ID is required'),
    type: z.string().min(1, 'Event type is required'),
    page: z.string().optional(),
    itemId: z.string().optional(),
    timestamp: z.string().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
