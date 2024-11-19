import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Search for Collection', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    const formatCollection = (data: any, responseData: any) => ({
        id: data.collections[0].id,
        name: data.collections[0].name,
        sets: [
            {
                comment: data.collections[0].sets[0].comment,
                set: {
                    id: data.collections[0].sets[0].flashcardSet.id,
                    name: data.collections[0].sets[0].flashcardSet.name,
                    user_id: data.collections[0].sets[0].flashcardSet.userId,
                    cards: data.collections[0].sets[0].flashcardSet.flashcards.map((card: any) => ({
                        id: card.id,
                        question: card.question,
                        answer: card.answer,
                        difficulty: card.difficulty,
                    })),
                    created_at: responseData.sets[0].set.created_at,
                    updated_at: responseData.sets[0].set.updated_at,
                },
            },
        ],
        user: {
            id: data.id,
            username: data.username,
        },
    })

    test('Successful Get a specific collection', async ({ assert, client }) => {
        const data = await UserFactory.with('collections', 1, (collection) => {
            collection.with('sets', 1, (collectionSet) => {
                collectionSet.with('flashcardSet', 1, (flashcardSet) => {
                    flashcardSet.with('flashcards', 1).with('user', 1)
                })
            })
        }).create()
        const response = await client.get(
            `/api/users/${data.collections[0].userId}/collections/${data.collections[0].id}`
        )

        const actualData = formatCollection(data, response.response.body.data)

        assert.equal(response.response.statusCode, 200)
        assert.deepEqual(response.response.body.data, actualData)
    })

    test('Collection Not Found', async ({ assert, client }) => {
        const response = await client.get(`/api/users/-1/collections/-1`)

        assert.equal(response.response.statusCode, 404)
    })
})
