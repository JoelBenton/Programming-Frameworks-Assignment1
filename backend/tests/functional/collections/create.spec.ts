import { FlashcardSetFactory } from '#database/factories/flashcard_set_factory'
import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Create a Collection', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    test('Successful Collection Creation', async ({ assert, client }) => {
        const user = await UserFactory.create()
        const flashcardSet = await FlashcardSetFactory.create()

        const actualData = {
            name: 'Cool Collection',
            sets: [
                {
                    comment: 'I love this set!',
                    setID: flashcardSet.id,
                },
            ],
            user: {
                id: user.id,
                username: user.username,
            },
        }

        const response = await client
            .post('/api/collections')
            .json({
                name: 'Cool Collection',
                sets: [
                    {
                        comment: 'I love this set!',
                        setID: flashcardSet.id,
                    },
                ],
                userId: user.id,
            })
            .loginAs(user)

        const responseData = response.response.body.data

        assert.equal(response.response.statusCode, 201)
        assert.deepEqual(responseData, actualData)
    })

    test('Unauthorised Collection Creation', async ({ assert, client }) => {
        const response = await client.post('/api/collections').json({})
        assert.equal(response.response.statusCode, 401)
    })

    test('Flashcard Set not found', async ({ assert, client }) => {
        const user = await UserFactory.create()
        const response = await client
            .post('/api/collections')
            .json({
                name: 'Cool Collection',
                sets: [
                    {
                        comment: 'I love this set!',
                        setID: -1,
                    },
                ],
                userId: user.id,
            })
            .loginAs(user)
        assert.equal(response.response.statusCode, 404)
    })
})
