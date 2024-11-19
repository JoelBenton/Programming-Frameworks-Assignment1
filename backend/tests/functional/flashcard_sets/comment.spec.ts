import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Create a Flashcard Set Comment', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    test('Successful creation of a comment on a flashcard set', async ({ assert, client }) => {
        const user = await UserFactory.create()
        const data = await UserFactory.with('flashcardSets', 1, (flashcardSet) => {
            flashcardSet.with('flashcards', 1)
        }).create()

        const response = await client
            .post(`/api/sets/${data.flashcardSets[0].id}/comment`)
            .json({ user_id: user.id, message: 'I like this set' })
            .loginAs(user)

        const responseData = response.response.body

        const finalData = {
            comment: 'I like this set',
            set: {
                id: data.flashcardSets[0].id,
                name: data.flashcardSets[0].name,
                user_id: data.flashcardSets[0].userId,
                cards: [
                    {
                        id: data.flashcardSets[0].flashcards[0].id,
                        question: data.flashcardSets[0].flashcards[0].question,
                        answer: data.flashcardSets[0].flashcards[0].answer,
                        difficulty: data.flashcardSets[0].flashcards[0].difficulty,
                    },
                ],
                created_at: responseData.set.created_at,
                updated_at: responseData.set.updated_at,
            },
            author: {
                id: user.id,
                username: user.username,
                admin: user.admin,
            },
        }

        assert.equal(response.response.statusCode, 201) // Created
        assert.deepEqual(responseData, finalData)
    })

    test('Not Logged in - Unauthorised update of limit', async ({ assert, client }) => {
        const response = await client.post('/api/sets/0/comment').json({})

        assert.equal(response.response.statusCode, 401) // Unauthorised
    })

    test('Flashcard Set Not Found', async ({ assert, client }) => {
        const user = await UserFactory.create()
        const response = await client.post('/api/sets/-1/comment').json({}).loginAs(user)

        assert.equal(response.response.statusCode, 404) // Not Found
    })

    test('Invalid Message or UserID', async ({ assert, client }) => {
        const user = await UserFactory.create()
        const data = await UserFactory.with('flashcardSets', 1).create()
        const response = await client
            .post(`/api/sets/${data.flashcardSets[0].id}/comment`)
            .json({ user_id: 'Not a number', message: 0 }) // 0 as its not a string
            .loginAs(user)

        assert.equal(response.response.statusCode, 400) // Bad Request
    })
})
