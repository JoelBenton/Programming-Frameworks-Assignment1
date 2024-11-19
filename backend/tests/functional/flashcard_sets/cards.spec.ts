import { UserFactory } from '#database/factories/user_factory'
import Flashcard from '#models/flashcard'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('All Flashcards from a set', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    test('Get a list of all Flashcards in a set', async ({ assert, client }) => {
        const data = await UserFactory.with('flashcardSets', 1, (flashcardSet) => {
            flashcardSet.with('flashcards', 2)
        }).create()

        const cards = [
            {
                id: data.flashcardSets[0].flashcards[0].id,
                question: data.flashcardSets[0].flashcards[0].question,
                answer: data.flashcardSets[0].flashcards[0].answer,
                difficulty: data.flashcardSets[0].flashcards[0].difficulty,
            },
            {
                id: data.flashcardSets[0].flashcards[1].id,
                question: data.flashcardSets[0].flashcards[1].question,
                answer: data.flashcardSets[0].flashcards[1].answer,
                difficulty: data.flashcardSets[0].flashcards[1].difficulty,
            },
        ]

        const response = await client.get(`/api/sets/${data.flashcardSets[0].id}/cards`)
        const ResponseData = response.response.body

        assert.equal(response.response.statusCode, 200)
        assert.deepEqual(ResponseData, cards)
    })

    test('Get a Shuffled list of all Flashcards in a set', async ({ assert, client }) => {
        // Step 1: Create test data
        const data = await UserFactory.with('flashcardSets', 1, (flashcardSet) => {
            flashcardSet.with('flashcards', 10)
        }).create()

        const originalIds = data.flashcardSets[0].flashcards.map((card) => card.id)

        const response = await client.get(
            `/api/sets/${data.flashcardSets[0].id}/cards?shuffle=true`
        )
        const responseData = response.response.body

        const responseIds = responseData.map((card: Flashcard) => card.id)

        assert.equal(response.response.statusCode, 200)

        assert.notDeepEqual(responseIds, originalIds, 'Flashcards should be shuffled')
        assert.includeMembers(
            responseIds,
            originalIds,
            'All original IDs should be present in the response'
        )
    })

    test('Set not found.', async ({ assert, client }) => {
        const response = await client.get(`/api/sets/-1/cards`)

        assert.equal(response.response.statusCode, 404) // NotFound
    })
})
