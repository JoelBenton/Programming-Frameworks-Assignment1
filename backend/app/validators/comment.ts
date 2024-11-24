import vine from '@vinejs/vine'

export const commentValidator = vine.compile(
    vine.object({
        user_id: vine.number(),
        message: vine.string(),
        rating: vine.number().min(1).max(5).optional(),
    })
)
