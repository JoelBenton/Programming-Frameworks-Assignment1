import factory from '@adonisjs/lucid/factories'
import FlashcardSet from '#models/flashcard_set'
import { UserFactory } from './user_factory.js'
import { FlashcardFactory } from './flashcard_factory.js'
import { CommentFactory } from './comment_factory.js'

export const FlashcardSetFactory = factory
    .define(FlashcardSet, async ({ faker }) => {
        return {
            name: faker.lorem.words(3),
        }
    })
    .relation('user', () => UserFactory)
    .relation('flashcards', () => FlashcardFactory)
    .relation('comments', () => CommentFactory)
    .build()
