import FlashcardSet from '#models/flashcard_set'
import type { HttpContext } from '@adonisjs/core/http'

export default class CardsController {
  /**
   * Display a list of resource
   */
  async index({ params, response }: HttpContext) {
    try {
      const flashcardSetId = params.set_id

      const flashcardSetModel = await FlashcardSet.findOrFail(flashcardSetId)

      await flashcardSetModel.load('flashcards')

      return response.ok(
        flashcardSetModel.flashcards.map((obj) => ({
          id: obj.id,
          question: obj.question,
          answer: obj.answer,
          difficulty: obj.difficulty,
        }))
      )
    } catch (error) {
      // If the flashcard set was not found
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: `Flashcard set with provided ID not found`,
        })
      }

      // Handle other errors (e.g., database connection issues)
      return response.internalServerError({
        message: 'An error occurred while fetching flashcards',
        error: error,
      })
    }
  }
}
