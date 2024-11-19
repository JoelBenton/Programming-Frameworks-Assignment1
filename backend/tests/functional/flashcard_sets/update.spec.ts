import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Update Flashcard Sets', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    test('Successful Update of a Flashcard Set', async ({ assert, client }) => {
        const CreatedData = await UserFactory.with('flashcardSets', 1, (flashcardSet) => {
            flashcardSet
                .with('comments', 1, (comment) => {
                    comment.with('user')
                })
                .with('flashcards', 1)
        }).create()

        const data = {
            name: 'New Name',
            user_id: CreatedData.flashcardSets[0].userId,
            cards: [
                {
                    id: CreatedData.flashcardSets[0].flashcards[0].id,
                    question: CreatedData.flashcardSets[0].flashcards[0].question,
                    answer: CreatedData.flashcardSets[0].flashcards[0].answer,
                    difficulty: CreatedData.flashcardSets[0].flashcards[0].difficulty,
                },
            ],
        }

        const response = await client
            .put(`/api/sets/${CreatedData.flashcardSets[0].id}`)
            .json(data)
            .loginAs(CreatedData)
        const responseData = response.response.body.data

        assert.equal(response.response.statusCode, 200)
        assert.deepEqual(responseData, {
            id: CreatedData.id,
            name: data.name,
            user_id: data.user_id,
            cards: data.cards,
            created_at: responseData.created_at,
            updated_at: responseData.updated_at,
        })
    })

    test('Unauthorised Update of a Flashcard Set from a different user', async ({
        assert,
        client,
    }) => {
        const user = await UserFactory.merge({ admin: false }).create()
        const CreatedData = await UserFactory.with('flashcardSets', 1, (flashcardSet) => {
            flashcardSet
                .with('comments', 1, (comment) => {
                    comment.with('user')
                })
                .with('flashcards', 1)
        }).create()

        const data = {
            name: 'New Name',
            user_id: CreatedData.flashcardSets[0].userId,
            cards: [
                {
                    id: CreatedData.flashcardSets[0].flashcards[0].id,
                    question: CreatedData.flashcardSets[0].flashcards[0].question,
                    answer: CreatedData.flashcardSets[0].flashcards[0].answer,
                    difficulty: CreatedData.flashcardSets[0].flashcards[0].difficulty,
                },
            ],
        }

        const response = await client
            .put(`/api/sets/${CreatedData.flashcardSets[0].id}`)
            .json({})
            .loginAs(user)

        assert.equal(response.response.statusCode, 401)
    })

    test('Unauthorised Client Request', async ({ assert, client }) => {
        const response = await client.put(`/api/sets/0`).json({})

        assert.equal(response.response.statusCode, 401)
    })

    test('Not Found Client Request', async ({ assert, client }) => {
        const user = await UserFactory.create()

        const response = await client.put(`/api/sets/-1`).json({}).loginAs(user)

        assert.equal(response.response.statusCode, 404)
    })
})
