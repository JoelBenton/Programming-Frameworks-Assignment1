import { z } from "zod";

export const setsInput = z.object({
    id: z.number().optional(),
    name: z.string().min(3).max(255),
    user_id: z.number(),
    cards: z.array(
        z.object({
            id: z.number().optional(),
            question: z.string(),
            answer: z.string(),
            difficulty: z.enum(["easy", "medium", "hard"]),
        }),
    ),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
});
