import { z } from 'zod';

const objectIdRegex = /^[a-f0-9]{24}$/i;

export const createApplicantSchema = z.object({
    userId: z.string().regex(objectIdRegex, 'Invalid User ID format'),
    sessionId: z.string().regex(objectIdRegex, 'Invalid Session ID format'),
    actionType: z.enum(['purchase', 'add_to_cart', 'wishlist', 'view', 'review']),
    itemId: z.string().max(500, 'Item ID exceeds max length').optional(),
    status: z.string().max(50, 'Status exceeds max length').optional(),
    timestamp: z.string().datetime().optional(),
});

export const filterApplicantSchema = z.object({
    userId: z.string().regex(objectIdRegex, 'Invalid User ID format').optional(),
    sessionId: z.string().regex(objectIdRegex, 'Invalid Session ID format').optional(),
    actionType: z.enum(['purchase', 'add_to_cart', 'wishlist', 'view', 'review']).optional(),
    status: z.string().max(50, 'Status exceeds max length').optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
});

export type CreateApplicantInput = z.infer<typeof createApplicantSchema>;
export type FilterApplicantInput = z.infer<typeof filterApplicantSchema>;
