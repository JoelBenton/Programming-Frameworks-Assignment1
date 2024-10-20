import FlashcardSet from '#models/flashcard_set'
import type { HttpContext } from '@adonisjs/core/http'

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
        this.shuffleArray(flashcards)
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

  // Utility function to shuffle an array -  This function uses the Fisher-Yates shuffle algorithm to shuffle the elements in the array in place. - https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }
}
