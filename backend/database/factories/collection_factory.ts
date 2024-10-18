import factory from '@adonisjs/lucid/factories'
import Collection from '#models/collection'

export const CollectionFactory = factory
  .define(Collection, async ({ faker }) => {
    return {
      comment: faker.lorem.sentence(),
      flashcardSetId: faker.number.int({ min: 1, max: 5 }),
      userId: faker.number.int({ min: 1, max: 10 }),
      created_at: faker.date.past(),
      updated_at: faker.date.recent(),
    }
  })
  .build()
