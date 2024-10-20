import vine from '@vinejs/vine'

export const flashcardSetsValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(255),
    userId: vine.number(),
    cards: vine.array(
      vine.object({
        id: vine.number().optional(),
        question: vine.string().trim(),
        answer: vine.string().trim(),
        difficulty: vine.enum(['easy', 'medium', 'hard']),
      })
    ),
  })
)
