import factory from '@adonisjs/lucid/factories'
import CollectionSet from '#models/collection_set'
import { FlashcardSetFactory } from './flashcard_set_factory.js'
import { CollectionFactory } from './collection_factory.js'

export const CollectionSetFactory = factory
    .define(CollectionSet, async ({ faker }) => {
        return {
            comment: faker.lorem.sentence(),
        }
    })
    .relation('collection', () => CollectionFactory)
    .relation('flashcardSet', () => FlashcardSetFactory)
    .build()
