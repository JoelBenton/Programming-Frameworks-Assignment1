import vine from '@vinejs/vine'

export const limitValidator = vine.compile(
  vine.object({
    limit: vine.number(),
  })
)
