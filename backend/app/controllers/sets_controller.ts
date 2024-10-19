import Flashcard from '#models/flashcard'
import FlashcardSet from '#models/flashcard_set'
import { flashcardSetsValidator } from '#validators/flashcard_set'
import type { HttpContext } from '@adonisjs/core/http'
import Redis from '@adonisjs/redis/services/main'

const totalRequestsKey = 'global:total_requests'
const limitKey = 'global_daily_limit'

function returnFlashcardSetData(flashcardSetData: FlashcardSet) {
  return {
    id: flashcardSetData.id,
    name: flashcardSetData.name,
    user_id: flashcardSetData.userId,
    cards: flashcardSetData.flashcards.map((obj) => ({
      id: obj.id,
      question: obj.question,
      answer: obj.answer,
      difficulty: obj.difficulty,
    })),
    created_at: flashcardSetData.createdAt,
    updated_at: flashcardSetData.updatedAt,
  }
}

export default class SetsController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      // Fetch all users from the database
      const flashcardSets = await FlashcardSet.query().preload('flashcards')

      // Map the users to include only the desired fields
      const flashcardSetsList = flashcardSets.map((obj) => returnFlashcardSetData(obj))

      // Return a structured response with a 200 status code
      return response.ok({
        message: 'Flashcard Sets retrieved successfully',
        data: flashcardSetsList,
      })
    } catch (error) {
      // Return a 500 Internal Server Error response
      return response.internalServerError({
        message: 'An error occurred while retrieving users',
        error: error.message,
      })
    }
  }

  /**
   * Display a list of resource for user ID.
   */
  async userIndex({ params, response }: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    try {
      let totalRequests = Number(await Redis.get(totalRequestsKey))
      const limit = Number(await Redis.get(limitKey))

      const remainingRequests = limit - totalRequests
      console.log(remainingRequests)

      if (remainingRequests <= 0) {
        return response.tooManyRequests({
          message: 'Rate limit exceeded. Try again tomorrow.',
        })
      }

      // Get all request data
      const data = request.all()

      // Validate the data using the validator
      const payload = await flashcardSetsValidator.validate(data)

      // Create the user in the database
      const flashcardSet = await FlashcardSet.create({
        name: payload.name,
        userId: payload.userId,
      })

      for (const card of payload.cards) {
        await Flashcard.create({
          question: card.question,
          answer: card.answer,
          difficulty: card.difficulty,
          flashcardSetId: flashcardSet.id,
        })
      }

      await flashcardSet.load('flashcards')

      Redis.set(totalRequestsKey, totalRequests + 1)

      // Return a response with the created user details
      return response.created({
        message: 'Flashcard Set Created',
        data: returnFlashcardSetData(flashcardSet),
      })
    } catch (error) {
      // Handle validation errors and other potential errors
      if (error.code === 'E_VALIDATION_FAILURE') {
        return response.badRequest({
          message: 'Data Validation failed / The user could not be created',
          errors: error.messages,
        })
      }

      // Handle any other errors
      return response.internalServerError({
        message: 'An error occurred while creating the Flashcard Set',
        error: error,
      })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const id = params.id

    try {
      const flashcardSet = await FlashcardSet.findOrFail(id)
      flashcardSet.delete()
      return response.created({
        message: 'Flashcard Set Deleted',
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.forbidden({
          message: 'No flashcard Set with that ID.',
          error: error.messages,
        })
      }

      // Handle any other errors
      return response.internalServerError({
        message: 'An error occurred while deleting the flashcard Set',
        error: error.messages,
      })
    }
  }
}
