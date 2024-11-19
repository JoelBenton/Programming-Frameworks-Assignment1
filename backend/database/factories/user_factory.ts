import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { FlashcardSetFactory } from './flashcard_set_factory.js'
import { CollectionFactory } from './collection_factory.js'
export const UserFactory = factory
    .define(User, async ({ faker }) => {
        return {
            username: faker.internet.displayName(),
            password: faker.internet.password(),
            admin: faker.datatype.boolean(),
        }
    })
    .relation('flashcardSets', () => FlashcardSetFactory)
    .relation('collections', () => CollectionFactory)
    .build()
