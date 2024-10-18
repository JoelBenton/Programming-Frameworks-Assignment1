import factory from '@adonisjs/lucid/factories'
import FlashcardSet from '#models/flashcard_set'

export const FlashcardSetFactory = factory
  .define(FlashcardSet, async ({ faker }) => {
    return {
      name: faker.lorem.words(3),
      userId: faker.number.int({ min: 1, max: 10 }),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }
  })
  .build()
