import { z } from 'zod';

export const createUserSchema = z.object({
    name: z.string().min(1, 'Name required').max(200, 'Name exceeds max length'),
    email: z.string().email('Invalid email format'),
});

export const searchUserSchema = z.object({
    query: z.string().max(200, 'Query exceeds max length').optional(),
    email: z.string().email('Invalid email format').optional(),
    page: z.string().default('1').transform(v => Math.max(1, parseInt(v, 10) || 1)),
    limit: z.string().default('10').transform(v => {
        let num = parseInt(v, 10) || 10;
        if (num < 1) num = 1;
        if (num > 500) num = 500;
        return num;
    }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type SearchUserInput = z.infer<typeof searchUserSchema>;
