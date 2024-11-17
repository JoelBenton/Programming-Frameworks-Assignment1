import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('User Delete', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    test('Delete user', async ({ assert, client }) => {
        const user = await UserFactory.create()

        const response = await client.delete(`/api/users/${user.id}`).loginAs(user)

        const users = await User.all()

        assert.equal(response.response.statusCode, 204)
        assert.equal(users.length, 0)
    })
    test('Admin Delete different user', async ({ assert, client }) => {
        const adminUser = await UserFactory.merge({ admin: true }).create()
        const normalUser = await UserFactory.create()

        const response = await client.delete(`/api/users/${normalUser.id}`).loginAs(adminUser)

        await adminUser.delete()

        const users = await User.all()

        assert.equal(response.response.statusCode, 204)
        assert.equal(users.length, 0)
    })
    test('Unauthorised User Deletion', async ({ assert, client }) => {
        const user = await UserFactory.create()

        const response = await client.delete(`/api/users/${user.id}`)

        assert.equal(response.response.statusCode, 401)
    })
    test('User not found', async ({ assert, client }) => {
        const user = await UserFactory.make()

        const response = await client.delete(`/api/users/${user.id}`)

        assert.equal(response.response.statusCode, 404)
    })
})
