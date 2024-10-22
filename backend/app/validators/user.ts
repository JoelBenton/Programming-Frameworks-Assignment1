import vine from '@vinejs/vine'

export const usersValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(2).maxLength(255),
    password: vine.string().trim(),
    admin: vine.boolean().optional(),
  })
)
