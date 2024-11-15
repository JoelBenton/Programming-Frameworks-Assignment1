import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('User Search', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    test('Search User', async ({ assert, client }) => {
        const user = await UserFactory.create()
        const expandedUser = { id: user.id, username: user.username, admin: user.admin }

        const response = await client.get(`/api/users/${user.id}`)
        const ResponseData = JSON.parse(response.response.text).data

        assert.equal(response.response.statusCode, 200)
        assert.deepEqual(ResponseData, expandedUser)
    })

    test('User not found', async ({ assert, client }) => {
        const response = await client.get(`/api/users/1`)

        assert.equal(response.response.statusCode, 404)
    })
})
