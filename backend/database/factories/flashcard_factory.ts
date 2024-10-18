import factory from '@adonisjs/lucid/factories'
import Flashcard from '#models/flashcard'

export const FlashcardFactory = factory
  .define(Flashcard, async ({ faker }) => {
    const difficulty = faker.helpers.arrayElement(['easy', 'medium', 'hard'])
    return {
      question: faker.lorem.sentence(),
      answer: faker.lorem.sentence(),
      difficulty: difficulty,
      flashcardSetId: faker.number.int({ min: 1, max: 5 }),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }
  })
  .build()
