import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('User Create', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    test('Create a user', async ({ assert, client }) => {
        const authUser = await UserFactory.merge({ admin: false }).create()
        const user = await UserFactory.merge({ admin: false }).make()

        const response = await client
            .post('/api/users')
            .json({
                username: user.username,
                admin: user.admin,
                password: user.password,
            })
            .loginAs(authUser)

        await authUser.delete()

        const users = await User.all()
        const responseBody = response.body()

        assert.equal(users.length, 1)
        assert.equal(response.response.statusCode, 201)

        // Validate response data
        assert.equal(responseBody.message, 'User Created')
        assert.deepEqual(responseBody.data, {
            id: users[0].id,
            username: users[0].username,
            admin: users[0].admin,
        })
    })
    test('Create a admin user', async ({ assert, client }) => {
        const authUser = await UserFactory.merge({ admin: true }).create()
        const user = await UserFactory.merge({ admin: true }).make()

        const response = await client
            .post('/api/users')
            .json({
                username: user.username,
                admin: user.admin,
                password: user.password,
            })
            .loginAs(authUser)

        await authUser.delete()

        const responseBody = response.body()
        const users = await User.all()

        assert.equal(users.length, 1)
        assert.equal(response.response.statusCode, 201)

        // Validate response data
        assert.equal(responseBody.message, 'User Created')
        assert.deepEqual(responseBody.data, {
            id: users[0].id,
            username: users[0].username,
            admin: users[0].admin,
        })
    })

    test('Unauthorised Admin User Creation', async ({ assert, client }) => {
        const authUser = await UserFactory.merge({ admin: false }).create()
        const user = await UserFactory.merge({ admin: true }).make()

        const response = await client
            .post('/api/users')
            .json({
                username: user.username,
                admin: user.admin,
                password: user.password,
            })
            .loginAs(authUser)

        assert.equal(response.response.statusCode, 403)
        assert.equal(response.response.body.message, 'Unauthorized access')
    })

    test('User Creation Failed', async ({ assert, client }) => {
        const authUser = await UserFactory.merge({ admin: false }).create()
        const user = await UserFactory.merge({ admin: false, username: 'A' }).make()

        const response = await client
            .post('/api/users')
            .json({
                username: user.username,
                admin: user.admin,
                password: user.password,
            })
            .loginAs(authUser)

        assert.equal(response.response.statusCode, 400)
        assert.typeOf(response.response.body.message, 'string')
    })
})
