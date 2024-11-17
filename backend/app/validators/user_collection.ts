import vine from '@vinejs/vine'

export const userCollectionsUpdateValidator = vine.compile(
    vine.object({
        name: vine.string().trim().minLength(1).maxLength(255),
        sets: vine.array(
            vine.object({
                comment: vine.string(),
                set: vine.object({
                    id: vine.number(),
                    name: vine.string().trim().minLength(1).maxLength(255),
                    userId: vine.number().optional(),
                    cards: vine.array(
                        vine.object({
                            id: vine.number().optional(),
                            question: vine.string().trim(),
                            answer: vine.string().trim(),
                            difficulty: vine.enum(['easy', 'medium', 'hard']),
                        })
                    ),
                }),
            })
        ),
        user: vine.object({
            id: vine.number(),
            username: vine.string(),
        }),
    })
)
