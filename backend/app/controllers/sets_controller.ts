import Flashcard from '#models/flashcard'
import FlashcardSet from '#models/flashcard_set'
import { isAdmin } from '#policies/main'
import { flashcardSetsValidator } from '#validators/flashcard_set'
import type { HttpContext } from '@adonisjs/core/http'
import Redis from '@adonisjs/redis/services/main'

const totalRequestsKey = 'global_total_requests'
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
    async userIndex({ params, response }: HttpContext) {
        const userId = params.user_id

        try {
            const flashcardSets = await FlashcardSet.query()
                .apply((scopes) => scopes.userId(userId))
                .preload('flashcards')
            const flashcardSetsList = flashcardSets.map((obj) => returnFlashcardSetData(obj))
            return response.ok({
                message: 'Users Created Flashcard sets found',
                data: flashcardSetsList,
            })
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({
                    message: 'The user was not found',
                    error: error.message,
                })
            }

            // Handle any other errors
            return response.internalServerError({
                message: 'An error occurred while obtaining Users created Flashcard Sets',
                error: error.message,
            })
        }
    }

    /**
     * Handle form submission for the create action
     */
    async store({ request, response, bouncer, auth }: HttpContext) {
        try {
            // Get current authenticated User
            const user = auth.getUserOrFail()

            let totalRequests = Number(await Redis.get(totalRequestsKey))
            const limit = Number(await Redis.get(limitKey))
            let admin = user.admin

            const remainingRequests = limit - totalRequests

            if (!admin) {
                if (remainingRequests <= 0) {
                    return response.tooManyRequests({
                        message: 'Rate limit exceeded. Try again tomorrow.',
                    })
                }
            }

            // Get all request data
            const data = request.all()

            // Validate the data using the validator
            const payload = await flashcardSetsValidator.validate(data)

            // Create the user in the database
            const flashcardSet = await FlashcardSet.create({
                name: payload.name,
                userId: user.id,
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

            if (!admin) {
                Redis.set(totalRequestsKey, totalRequests + 1)
            }

            // Return a response with the created user details
            return response.created({
                message: 'Flashcard Set Created',
                data: returnFlashcardSetData(flashcardSet),
            })
        } catch (error) {
            // Handle validation errors and other potential errors
            if (error.code === 'E_VALIDATION_ERROR') {
                return response.badRequest({
                    message: 'Data Validation failed / The flashcard set could not be created',
                    errors: error.message,
                })
            }

            // Handle any other errors
            return response.internalServerError({
                message: 'An error occurred while creating the Flashcard Set',
                error: error.message,
            })
        }
    }

    /**
     * Show individual record
     */
    async show({ params, response }: HttpContext) {
        const id = params.id

        try {
            const flashcardSet = await FlashcardSet.findOrFail(id)
            await flashcardSet.load('flashcards')
            await flashcardSet.load('comments', (commentQuery) => {
                commentQuery.preload('user')
            })
            const flashcardSetsList = returnFlashcardSetData(flashcardSet)

            const flashcardSetsWithComments = {
                ...flashcardSetsList,
                comments: flashcardSet.comments.map((comment) => ({
                    comment: comment.comment,
                    comment_id: comment.id,
                    rating: comment.rating,
                    author: {
                        id: comment.user.id,
                        username: comment.user.username,
                        admin: Boolean(comment.user.admin),
                    },
                })),
            }
            return response.ok({
                message: 'Flashcard set found',
                data: flashcardSetsWithComments,
            })
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({
                    message: 'The Flashcard Set was not found',
                    error: error.message,
                })
            }

            // Handle any other errors
            return response.internalServerError({
                message: 'An error occurred while obtaining Flashcard Sets',
                error: error.message,
            })
        }
    }

    /**
     * Handle form submission for the edit action
     */
    async update({ params, request, response, auth }: HttpContext) {
        const setId = params.id

        try {
            const user = auth.getUserOrFail()
            const flashcardSet = await FlashcardSet.findOrFail(setId)

            if (user.id !== flashcardSet.userId) {
                return response.unauthorized({ message: 'Unauthorized access' })
            }

            const data = request.all()
            const payload = await flashcardSetsValidator.validate(data)

            flashcardSet.name = payload.name
            await flashcardSet.save()
            const existingFlashcards = await flashcardSet.related('flashcards').query()

            // Create a map of existing flashcards by their ID for easy lookup
            const existingFlashcardsMap = new Map(existingFlashcards.map((card) => [card.id, card]))

            // Track the IDs of the cards in the request payload
            const incomingCardIds = payload.cards
                .map((card) => card.id)
                .filter((id) => id !== undefined)

            // 1. Delete cards that are no longer in the incoming request
            const cardsToDelete = existingFlashcards.filter(
                (card) => !incomingCardIds.includes(card.id)
            )
            await Promise.all(cardsToDelete.map((card) => card.delete()))

            // 2. Add or update the flashcards
            for (const cardData of payload.cards) {
                if (cardData.id) {
                    // Update existing card
                    const existingCard = existingFlashcardsMap.get(cardData.id)
                    if (existingCard) {
                        existingCard.question = cardData.question
                        existingCard.answer = cardData.answer
                        existingCard.difficulty = cardData.difficulty
                        await existingCard.save()
                    }
                } else {
                    // Create a new flashcard
                    await flashcardSet.related('flashcards').create({
                        question: cardData.question,
                        answer: cardData.answer,
                        difficulty: cardData.difficulty,
                    })
                }
            }

            await flashcardSet.load('flashcards')

            return response.ok({
                message: 'Flashcard set updated successfully',
                data: returnFlashcardSetData(flashcardSet),
            })
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({
                    message: 'Flashcard set not found',
                    error: error.message,
                })
            }

            // Handle validation errors
            if (error.code === 'E_VALIDATION_ERROR') {
                return response.badRequest({
                    message: 'Data Validation failed',
                    errors: error.message,
                })
            }

            // Handle any other errors
            return response.internalServerError({
                message: 'An error occurred while updating the flashcard set',
                error: error,
            })
        }
    }

    /**
     * Delete record
     */
    async destroy({ params, response, auth }: HttpContext) {
        const id = params.id

        try {
            const user = auth.getUserOrFail()
            const flashcardSet = await FlashcardSet.findOrFail(id)

            if (user.id !== flashcardSet.userId) {
                return response.unauthorized({ message: 'Unauthorized access' })
            }

            flashcardSet.delete()
            return response.noContent()
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({
                    message: 'No flashcard Set with that ID.',
                    error: error.message,
                })
            }

            // Handle any other errors
            return response.internalServerError({
                message: 'An error occurred while deleting the flashcard Set',
                error: error.message,
            })
        }
    }
}
