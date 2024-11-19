import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import redis from '@adonisjs/redis/services/main'
import { test } from '@japa/runner'

test.group('Get Flashcard Set Limit info', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    test('Successful Get of limit info', async ({ assert, client }) => {
        const totalRequestsKey = 'global_total_requests'
        const limitKey = 'global_daily_limit'

        redis.set(totalRequestsKey, 10)
        redis.set(limitKey, 25)

        const response = await client.get('/api/sets/get-limit-info')

        assert.equal(response.response.statusCode, 200)
        assert.equal(response.response.body.limit, 25)
        assert.equal(response.response.body.totalRequests, 10)
    })
})
