import vine from '@vinejs/vine'

export const usersValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(2).maxLength(100),
    password: vine.string().trim(),
    admin: vine.boolean(),
  })
)
