import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Update a Collection', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    const formatCollection = (
        data: any,
        responseData?: any,
        includeTimestamps: boolean = false
    ) => ({
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
                    created_at: includeTimestamps
                        ? data.collections[0].sets[0].flashcardSet.created_at
                        : responseData.sets[0].set.created_at,
                    updated_at: includeTimestamps
                        ? data.collections[0].sets[0].flashcardSet.updated_at
                        : responseData.sets[0].set.updated_at,
                },
            },
        ],
        user: {
            id: data.id,
            username: data.username,
        },
    })

    test('Successful Update a specific collection', async ({ assert, client }) => {
        const data = await UserFactory.with('collections', 1, (collection) => {
            collection.with('sets', 1, (collectionSet) => {
                collectionSet.with('flashcardSet', 1, (flashcardSet) => {
                    flashcardSet.with('flashcards', 1).with('user', 1)
                })
            })
        }).create()

        const formattedData = formatCollection(data, undefined, true)
        formattedData.name = 'Updated Name'

        const response = await client
            .put(`/api/users/${data.collections[0].userId}/collections/${data.collections[0].id}`)
            .json(formattedData)
            .loginAs(data)

        formattedData.sets[0].set.updated_at = response.response.body.data.sets[0].set.updated_at
        formattedData.sets[0].set.created_at = response.response.body.data.sets[0].set.created_at

        assert.equal(response.response.statusCode, 200)
        assert.equal(response.response.body.data.name, 'Updated Name')
        assert.deepEqual(response.response.body.data, formattedData)
    })

    test('Forbidden update, User updating someone elses collection', async ({ assert, client }) => {
        const user = await UserFactory.merge({ admin: false }).create()
        const data = await UserFactory.with('collections', 1, (collection) => {
            collection.with('sets', 1, (collectionSet) => {
                collectionSet.with('flashcardSet', 1, (flashcardSet) => {
                    flashcardSet.with('flashcards', 1).with('user', 1)
                })
            })
        }).create()

        const formattedData = formatCollection(data, undefined, true)
        formattedData.name = 'Updated Name'

        const response = await client
            .put(`/api/users/${data.collections[0].userId}/collections/${data.collections[0].id}`)
            .json(formattedData)
            .loginAs(user)

        assert.equal(response.response.statusCode, 403)
    })

    test('Collection Not Found', async ({ assert, client }) => {
        const user = await UserFactory.merge({ admin: false }).create()
        const response = await client.put(`/api/users/${user.id}/collections/-1`).loginAs(user)

        assert.equal(response.response.statusCode, 404)
    })

    test('Not Logged in', async ({ assert, client }) => {
        const response = await client.put(`/api/users/-1/collections/-1`)

        assert.equal(response.response.statusCode, 401)
    })
})
