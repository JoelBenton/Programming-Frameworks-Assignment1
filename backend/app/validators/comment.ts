import vine from '@vinejs/vine'

export const commentValidator = vine.compile(
  vine.object({
    userId: vine.number(),
    message: vine.string(),
  })
)
