import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    username: vine.string().unique(async (query, field) => {
      const user = await query.from('users').where('username', field).first()
      return !user
    }),
    password: vine.string().minLength(6).maxLength(512),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    username: vine.string(),
    password: vine.string().minLength(6).maxLength(512),
  })
)
