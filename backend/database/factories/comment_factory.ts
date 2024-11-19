import factory from '@adonisjs/lucid/factories'
import Comment from '#models/comment'
import { UserFactory } from './user_factory.js'
import { FlashcardSetFactory } from './flashcard_set_factory.js'

export const CommentFactory = factory
    .define(Comment, async ({ faker }) => {
        return {
            comment: faker.lorem.sentence(),
        }
    })
    .relation('user', () => UserFactory)
    .relation('flashcardSet', () => FlashcardSetFactory)
    .build()
