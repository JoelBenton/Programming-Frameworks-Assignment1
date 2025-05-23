import Comment from '#models/comment'
import FlashcardSet from '#models/flashcard_set'
import { commentValidator } from '#validators/comment'
import type { HttpContext } from '@adonisjs/core/http'

export default class CommentsController {
    /**
     * Handle form submission for the create action
     */
    async store({ params, request, response }: HttpContext) {
        try {
            const flashcardSetId = params.set_id

            // Check if the flashcard set exists
            const flashcardSet = await FlashcardSet.find(flashcardSetId)
            if (!flashcardSet) {
                return response.notFound({
                    message: `Flashcard set with ID ${flashcardSetId} not found`,
                })
            }
            const payload = request.all()
            const data = await commentValidator.validate(payload)

            const comment = await Comment.create({
                userId: data.user_id,
                comment: data.message,
                rating: data.rating,
                flashcardSetId: flashcardSetId,
            })
            await comment.load('flashcardSet')
            await comment.load('user')
            await comment.flashcardSet.load('flashcards')

            return response.created({
                comment: comment.comment,
                comment_id: comment.id,
                rating: comment.rating,
                set: {
                    id: comment.flashcardSet.id,
                    name: comment.flashcardSet.name,
                    user_id: comment.flashcardSet.userId,
                    cards: comment.flashcardSet.flashcards.map((obj) => ({
                        id: obj.id,
                        question: obj.question,
                        answer: obj.answer,
                        difficulty: obj.difficulty,
                    })),
                    created_at: comment.flashcardSet.createdAt,
                    updated_at: comment.flashcardSet.updatedAt,
                },
                author: {
                    id: comment.user.id,
                    username: comment.user.username,
                    admin: Boolean(comment.user.admin),
                },
            })
        } catch (error) {
            if (error.code === 'E_VALIDATION_ERROR') {
                return response.badRequest({
                    message: 'Data Validation failed',
                    errors: error.message,
                })
            }
            // Handle any other errors
            return response.internalServerError({
                message: 'An error occurred while creating the comment',
                error: error.message,
            })
        }
    }

    async destroy({ params, response }: HttpContext) {
        try {
            const id = params.id
            const comment = await Comment.findOrFail(id)
            await comment.delete()
            return response.noContent()
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({
                    message: 'The comment was not found',
                    error: error.message,
                })
            }

            // Handle any other errors
            return response.internalServerError({
                message: 'An error occurred while deleting the comment',
                error: error.message,
            })
        }
    }
}
