import { z } from 'zod';

const objectIdRegex = /^[a-f0-9]{24}$/i;

export const createEventSchema = z.object({
    sessionId: z.string().regex(objectIdRegex, 'Invalid Session ID format').optional().nullable(),
    userId: z.string().regex(objectIdRegex, 'Invalid User ID format'),
    type: z.enum(['page_view', 'purchase', 'add_to_cart', 'click', 'form_submit', 'video_play', 'error']).optional(),
    eventType: z.enum(['page_view', 'purchase', 'add_to_cart', 'click', 'form_submit', 'video_play', 'error']).optional(),
    duration: z.number().nonnegative('Duration cannot be negative').optional(),
    purchaseCount: z.number().nonnegative('Purchase count cannot be negative').optional(),
    page: z.string().max(500, 'Page exceeds max length').optional(),
    itemId: z.string().max(500, 'Item ID exceeds max length').optional(),
    timestamp: z.string().datetime().optional(),
    metadata: z.record(z.string(), z.any()).optional(),
}).refine(
    (data) => data.type || data.eventType,
    { message: 'Either type or eventType is required' }
);

export const queryParamsSchema = z.object({
    page: z.string().default('1').transform(v => {
        const num = parseInt(v, 10) || 1;
        return num < 1 ? 1 : num;
    }),
    limit: z.string().default('50').transform(v => {
        let num = parseInt(v, 10) || 50;
        if (num < 1) num = 1;
        if (num > 500) num = 500;
        return num;
    }),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type QueryParams = z.infer<typeof queryParamsSchema>;
