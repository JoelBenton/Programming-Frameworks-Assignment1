import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Update Flashcard Set Creation Limit', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    test('Successful update of limit', async ({ assert, client }) => {
        const user = await UserFactory.merge({ admin: true }).create()
        const response = await client
            .post('/api/sets/update-limit')
            .json({ limit: 25 })
            .loginAs(user)

        assert.equal(response.response.statusCode, 200)
        assert.equal(response.response.body.newLimit, 25)
    })

    test('Non-admin - Unauthorised update of limit', async ({ assert, client }) => {
        const user = await UserFactory.merge({ admin: false }).create()
        const response = await client
            .post('/api/sets/update-limit')
            .json({ limit: 25 })
            .loginAs(user)

        assert.equal(response.response.statusCode, 401)
    })

    test('Not Logged in - Unauthorised update of limit', async ({ assert, client }) => {
        const response = await client.post('/api/sets/update-limit').json({ limit: 25 })

        assert.equal(response.response.statusCode, 401)
    })

    test('Invalid Limit passed to client', async ({ assert, client }) => {
        const user = await UserFactory.merge({ admin: true }).create()
        const response = await client
            .post('/api/sets/update-limit')
            .json({ limit: 'banana' })
            .loginAs(user)

        assert.equal(response.response.statusCode, 400)
    })
})
