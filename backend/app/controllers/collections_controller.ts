import type { HttpContext } from '@adonisjs/core/http'
import Collection from '#models/collection'
import { collectionsValidator } from '#validators/collection'
import CollectionSet from '#models/collection_set'
import { getRandomObject } from '../helper/utils_helper.js'

function returnCollectionData(CollectionData: Collection) {
    const formattedData = {
        name: CollectionData.name,
        sets: CollectionData.sets.map((set) => ({
            comment: set.comment,
            set: {
                id: set.flashcardSetId,
                name: set.flashcardSet.name,
                cards: set.flashcardSet.flashcards.map((card) => ({
                    id: card.id,
                    question: card.question,
                    answer: card.answer,
                    difficulty: card.difficulty,
                })),
                created_at: set.flashcardSet.createdAt,
                updated_at: set.flashcardSet.updatedAt,
            },
        })),
        user: {
            id: CollectionData.user.id,
            username: CollectionData.user.username,
        },
    }
    // console.log(JSON.stringify(formattedData))
    return formattedData
}

export default class CollectionsController {
    /**
     * Display a list of resource
     */
    async index({ response }: HttpContext) {
        try {
            // Fetch all Collections
            const collections = await Collection.query()
                .preload('sets', (setQuery) => {
                    setQuery.preload('flashcardSet', (cardQuery) => {
                        cardQuery.preload('flashcards')
                    })
                })
                .preload('user')

            const collectionsList = collections.map((collection) =>
                returnCollectionData(collection)
            )

            return response.ok({
                message: 'Collections retrieved successfully',
                data: collectionsList,
            })
        } catch (error) {
            console.log(error)
            return response.internalServerError({
                message: 'An error occurred while obtaining Flashcard Sets',
                error: error.message,
            })
        }
    }

    /**
     * Handle form submission for the create action
     */
    async store({ request, response, auth }: HttpContext) {
        try {
            // Get Authed User.
            const user = auth.getUserOrFail()

            // Gall all request data
            const data = request.all()

            // Validate data.
            const payload = await collectionsValidator.validate(data)

            const collection = await Collection.create({
                name: payload.name,
                userId: user.id,
            })

            for (const set of payload.sets) {
                await CollectionSet.create({
                    collectionId: collection.id,
                    flashcardSetId: set.setID,
                    comment: set.comment,
                })
            }

            await collection.load('sets')
            await collection.load('user')

            return response.ok({
                message: 'Flashcard set collection Created',
                data: {
                    name: collection.name,
                    sets: collection.sets,
                    user: collection.user,
                },
            })
        } catch (error) {
            console.log(error)
            if (error.status() === 401) {
                return response.unauthorized({
                    message: 'Unauthorised User',
                    error: error.message,
                })
            }
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({
                    message: 'The Flashcard Set was not found',
                    error: error.message,
                })
            }
            return response.internalServerError({
                message: 'An error occurred while obtaining Flashcard Sets',
                error: error.message,
            })
        }
    }

    /**
     * Redirect to a random resource
     */
    async indexRandom({ response }: HttpContext) {
        try {
            const collections = await Collection.all()

            if (collections.length === 0) {
                response.notFound({
                    message: 'No Collections Found.',
                })
            }

            const collection = getRandomObject(collections)

            response.ok({
                url: `/users/${collection?.userId}/collections/${collection?.id}`,
            })
        } catch (error) {
            if (error.code === 'E_ROW_NOT_FOUND') {
                return response.notFound({
                    message: 'No Collections Found.',
                    error: error.message,
                })
            }
        }
    }
}
