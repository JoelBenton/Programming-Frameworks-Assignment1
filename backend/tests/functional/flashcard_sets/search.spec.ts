import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Find Flashcard Set based on Set ID', (group) => {
    group.each.setup(async () => testUtils.db().withGlobalTransaction())

    test('Get Flashcard Set', async ({ assert, client }) => {
        const CreatedData = await UserFactory.with('flashcardSets', 1, (flashcardSet) => {
            flashcardSet
                .with('comments', 1, (comment) => {
                    comment.with('user')
                })
                .with('flashcards', 1)
        }).create()

        const response = await client.get(`/api/sets/${CreatedData.id}`)
        const responseData = response.response.body.data

        const data = {
            id: CreatedData.flashcardSets[0].id,
            name: CreatedData.flashcardSets[0].name,
            user_id: CreatedData.id,
            cards: [
                {
                    id: CreatedData.flashcardSets[0].flashcards[0].id,
                    question: CreatedData.flashcardSets[0].flashcards[0].question,
                    answer: CreatedData.flashcardSets[0].flashcards[0].answer,
                    difficulty: CreatedData.flashcardSets[0].flashcards[0].difficulty,
                },
            ],
            created_at: responseData.created_at,
            updated_at: responseData.updated_at,
            comments: [
                {
                    comment: CreatedData.flashcardSets[0].comments[0].comment,
                    author: {
                        id: CreatedData.flashcardSets[0].comments[0].user.id,
                        username: CreatedData.flashcardSets[0].comments[0].user.username,
                        admin: CreatedData.flashcardSets[0].comments[0].user.admin,
                    },
                },
            ],
        }

        assert.equal(response.response.statusCode, 200)
        assert.deepEqual(responseData, data)
    })

    test('Flashcard Set not found', async ({ assert, client }) => {
        const response = await client.get(`/api/sets/0`)

        assert.equal(response.response.statusCode, 404)
    })
})
