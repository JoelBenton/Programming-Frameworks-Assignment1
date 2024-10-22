import FlashcardSet from '#models/flashcard_set'
import type { HttpContext } from '@adonisjs/core/http'
import { shuffleArray } from '../helper/utils_helper.js'

export default class CardsController {
  /**
   * Display a list of resource
   */
  async index({ params, response }: HttpContext) {
    try {
      const flashcardSetId = params.set_id
      const shuffle = params.shuffle === 'true'

      const flashcardSetModel = await FlashcardSet.findOrFail(flashcardSetId)

      await flashcardSetModel.load('flashcards')

      // Get the flashcards
      const flashcards = flashcardSetModel.flashcards.map((obj) => ({
        id: obj.id,
        question: obj.question,
        answer: obj.answer,
        difficulty: obj.difficulty,
      }))

      // Shuffle if requested
      if (shuffle) {
        shuffleArray(flashcards)
      }

      return response.ok(flashcards)
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: `Flashcard set with provided ID not found`,
        })
      }

      return response.internalServerError({
        message: 'An error occurred while fetching flashcards',
        error: error,
      })
    }
  }
}
