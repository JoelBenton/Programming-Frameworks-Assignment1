import vine from '@vinejs/vine'

export const commentValidator = vine.compile(
  vine.object({
    user_id: vine.number(),
    message: vine.string(),
  })
)
