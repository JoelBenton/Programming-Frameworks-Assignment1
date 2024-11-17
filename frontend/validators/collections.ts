import { z } from "zod";

export const collectionsInput = z.object({
    name: z.string().min(3).max(255),
    sets: z.array(
        z.object({
            comment: z.string(),
            setID: z.number(),
        }),
    ),
    userId: z.number(),
});
