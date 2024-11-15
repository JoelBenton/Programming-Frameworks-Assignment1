import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('User update', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    test('Update authed user.', async ({ assert, client }) => {
        const user = await UserFactory.merge({ admin: false }).create()

        const response = await client
            .put(`/api/users/${user.id}`)
            .json({
                username: 'NewUsername',
                password: 'NewPassword',
            })
            .loginAs(user)

        const ResponseData = JSON.parse(response.response.text).data

        assert.equal(response.response.statusCode, 200)
        assert.equal(ResponseData.username, 'NewUsername')
    })
    test('Admin update user', async ({ assert, client }) => {
        const adminUser = await UserFactory.merge({ admin: true }).create()
        const user = await UserFactory.merge({ admin: false }).create()

        const response = await client
            .put(`/api/users/${user.id}`)
            .json({
                username: 'NewUsername',
                password: 'NewPassword',
            })
            .loginAs(adminUser)

        const ResponseData = JSON.parse(response.response.text).data

        assert.equal(response.response.statusCode, 200)
        assert.equal(ResponseData.username, 'NewUsername')
    })
    test('Admin updates User to admin', async ({ assert, client }) => {
        const adminUser = await UserFactory.merge({ admin: true }).create()
        const user = await UserFactory.merge({ admin: false }).create()

        const response = await client
            .put(`/api/users/${user.id}`)
            .json({
                username: user.username,
                password: user.password,
                admin: true,
            })
            .loginAs(adminUser)

        const ResponseData = JSON.parse(response.response.text).data

        assert.equal(response.response.statusCode, 200)
        assert.equal(ResponseData.admin, true)
    })
    test('Unauthorised User Update from different None Admin User.', async ({ assert, client }) => {
        const user = await UserFactory.merge({ admin: false }).create()
        const user2 = await UserFactory.merge({ admin: false }).create()

        const response = await client
            .put(`/api/users/${user2.id}`)
            .json({
                username: 'NewUsername',
                password: 'NewPassword',
            })
            .loginAs(user)

        assert.equal(response.response.statusCode, 403)
    })
    test('Data Validation Error', async ({ assert, client }) => {
        const user = await UserFactory.merge({ admin: false }).create()

        const response = await client
            .put(`/api/users/${user.id}`)
            .json({
                username: 'N',
                password: user.password,
            })
            .loginAs(user)

        assert.equal(response.response.statusCode, 400)
    })
    test('User not found', async ({ assert, client }) => {
        const user = await UserFactory.merge({ admin: true }).create()
        const response = await client
            .put(`/api/users/100`)
            .json({
                username: 'NewUsername',
                password: user.password,
            })
            .loginAs(user)

        assert.equal(response.response.statusCode, 404)
    })
})
