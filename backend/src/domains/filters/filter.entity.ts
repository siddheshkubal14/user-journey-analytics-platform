import { z } from "zod";

export const filterQuerySchema = z.object({
    userId: z.string().optional(),
    sessionId: z.string().optional(),
    eventType: z.string().optional(),
    actionType: z.string().optional(),
    status: z.string().optional(),

    productId: z.string().optional(),
    itemId: z.string().optional(),

    from: z.string().optional(),
    to: z.string().optional(),
});

export type FilterQueryDTO = z.infer<typeof filterQuerySchema>;
