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

      const payload = request.all()
      const data = await commentValidator.validate(payload)

      // Check if the flashcard set exists
      const flashcardSet = await FlashcardSet.find(flashcardSetId)
      if (!flashcardSet) {
        return response.notFound({
          message: `Flashcard set with ID ${flashcardSetId} not found`,
        })
      }

      const comment = await Comment.create({
        userId: data.userId,
        comment: data.message,
        flashcardSetId: flashcardSetId,
      })
      await comment.load('flashcardSet')
      await comment.load('user')
      await comment.flashcardSet.load('flashcards')

      console.log(comment.flashcardSet)

      return response.created({
        comment: comment.comment,
        set: {
          id: comment.flashcardSet.id,
          name: comment.flashcardSet.name,
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
      console.error('Error creating comment:', error)

      // Handle validation errors
      if (error.code === 'E_VALIDATION_FAILURE') {
        return response.badRequest({
          message: 'Validation failed',
          errors: error.message, // Assuming error contains messages
        })
      }

      // Handle any other errors
      return response.internalServerError({
        message: 'An error occurred while creating the comment',
        error: error.message,
      })
    }
  }
}
