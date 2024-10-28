import Collection from '#models/collection'
import CollectionSet from '#models/collection_set'
import { userCollectionsValidator } from '#validators/user_collection'
import type { HttpContext } from '@adonisjs/core/http'

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

export default class UserCollectionsController {
  /**
   * Display a list of resource
   */
  async index({ params, response }: HttpContext) {
    const userId = params.user_id

    try {
      const collections = await Collection.query()
        .where('userId', userId)
        .preload('sets', (setQuery) => {
          setQuery.preload('flashcardSet', (cardQuery) => {
            cardQuery.preload('flashcards')
          })
        })
        .preload('user')

      if (collections.length === 0) {
        response.notFound({
          message: 'No Collections Found for this user.',
        })
      }
      const collectionsList = collections.map((collection) => returnCollectionData(collection))

      response.ok({
        message: 'Collections Found',
        data: collectionsList,
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'The Collections was not found for that user',
          error: error.message,
        })
      }
      return response.internalServerError({
        message: 'An error occurred while obtaining Collections',
        error: error.message,
      })
    }
  }

  /**
   * Show individual record
   */
  async show({ response, params }: HttpContext) {
    const userId = params.user_id
    const collectionId = params.id

    try {
      const collection = await Collection.query()
        .where('userId', userId)
        .andWhere('id', collectionId)
        .preload('sets', (setQuery) => {
          setQuery.preload('flashcardSet', (cardQuery) => {
            cardQuery.preload('flashcards')
          })
        })
        .preload('user')
        .limit(1)

      if (collection.length === 0) {
        return response.notFound({
          message: 'The Collection was not for found that user',
        })
      }

      response.ok({
        message: 'Collection Found',
        data: returnCollectionData(collection[0]),
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'The Collection was not found for that user',
          error: error.message,
        })
      }

      return response.internalServerError({
        message: 'An error occurred while obtaining Collection',
        error: error.message,
      })
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, auth }: HttpContext) {
    try {
      const userId = params.user_id
      const collectionId = params.id
      const user = auth.getUserOrFail()

      if (Number(userId) !== Number(user.id)) {
        return response.forbidden({
          message: 'You are not allowed to delete this collection',
        })
      }

      const data = request.all()
      const payload = await userCollectionsValidator.validate(data)

      const collection = await Collection.query()
        .where('userId', userId)
        .andWhere('id', collectionId)
        .preload('sets', (setQuery) => {
          setQuery.preload('flashcardSet', (cardQuery) => {
            cardQuery.preload('flashcards')
          })
        })
        .preload('user')
        .firstOrFail()

      collection.name = payload.name
      await collection.save()

      const existingCollectionSets = collection.sets

      await Promise.all(existingCollectionSets.map((collectionSet) => collectionSet.delete()))

      const updatedCollectionSets = payload.sets.map((set) => ({
        comment: set.comment,
        flashcardSetId: set.setId,
        collectionId: collectionId,
      }))

      await CollectionSet.createMany(updatedCollectionSets)

      await collection.load('sets', (flashcardSetQuery) => {
        flashcardSetQuery.preload('flashcardSet', (cardsQuery) => {
          cardsQuery.preload('flashcards')
        })
      })

      console.log(JSON.stringify(collection))

      return response.ok({
        message: 'Flashcard set updated successfully',
        data: returnCollectionData(collection),
      })
    } catch (error) {
      console.log(error)
      if (error.status === 401) {
        return response.unauthorized({
          message: 'You are not Authorised / Logged in.',
          error: error.message,
        })
      }
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'The Collection was not found for user',
          error: error.message,
        })
      }
      return response.internalServerError({
        message: 'An error occurred while obtaining Collection',
        error: error.message,
      })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response, auth }: HttpContext) {
    const userId = params.user_id
    const collectionId = params.id

    try {
      const user = auth.getUserOrFail()

      if (Number(userId) !== Number(user.id)) {
        return response.unauthorized({
          message: 'You are not allowed to delete this collection',
        })
      }

      const collection = await Collection.query()
        .where('userId', userId)
        .andWhere('id', collectionId)
        .preload('sets', (setQuery) => {
          setQuery.preload('flashcardSet', (cardQuery) => {
            cardQuery.preload('flashcards')
          })
        })
        .preload('user')
        .firstOrFail()

      console.log(collection)

      collection.delete()

      response.noContent()
    } catch (error) {
      if (error.status === 401) {
        return response.unauthorized({
          message: 'You are not Authorised / Logged in.',
          error: error.message,
        })
      }
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'The Collection was not found for user',
          error: error.message,
        })
      }
      return response.internalServerError({
        message: 'An error occurred while obtaining Collection',
        error: error.message,
      })
    }
  }
}
