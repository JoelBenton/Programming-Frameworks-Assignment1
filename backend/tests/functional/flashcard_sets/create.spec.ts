import { FlashcardFactory } from '#database/factories/flashcard_factory'
import { FlashcardSetFactory } from '#database/factories/flashcard_set_factory'
import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import redis from '@adonisjs/redis/services/main'
import { test } from '@japa/runner'

test.group('Create Flashcard Set', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    group.setup(async () => {
        await redis.flushall()
    })
    test('Create a Flashcard Set', async ({ assert, client }) => {
        const user = await UserFactory.merge({ admin: false }).create()
        const flashcardSet = await FlashcardSetFactory.make()
        const flashcards = await FlashcardFactory.makeMany(1) // Create Many even with 1 so that its an array

        const data = {
            name: flashcardSet.name,
            cards: flashcards,
        }

        const response = await client.post('/api/sets').json(data).loginAs(user)
        const responseData = response.response.body.data

        const tr = Number(await redis.get('global_total_requests'))

        assert.equal(response.response.statusCode, 201)
        assert.equal(tr, 1)
        assert.deepEqual(responseData, {
            id: 1,
            name: data.name,
            user_id: 1,
            cards: [
                {
                    id: 1,
                    question: data.cards[0].question,
                    answer: data.cards[0].answer,
                    difficulty: data.cards[0].difficulty,
                },
            ],
            created_at: responseData.created_at,
            updated_at: responseData.updated_at,
        })
    })
    test('Max Number of Flashcard Sets Created Today', async ({ assert, client }) => {
        const user = await UserFactory.merge({ admin: false }).create()

        await redis.set('global_total_requests', 1)
        await redis.set('global_daily_limit', 1)

        const response = await client.post('/api/sets').json({}).loginAs(user)

        assert.equal(response.response.statusCode, 429)
    })

    test('Unauthorised Creation of a Flashcard Set', async ({ assert, client }) => {
        await redis.flushall()
        const response = await client.post('/api/sets').json({})

        assert.equal(response.response.statusCode, 401)
    })
})
