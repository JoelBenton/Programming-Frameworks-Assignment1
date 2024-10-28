import vine from '@vinejs/vine'

export const collectionsValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255),
    sets: vine.array(
      vine.object({
        comment: vine.string(),
        setID: vine.number(),
      })
    ),
    userId: vine.number(),
  })
)
