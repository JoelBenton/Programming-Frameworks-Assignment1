import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Auth login', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    test('Successful Login', async ({ assert, client }) => {
        const user = await UserFactory.make()

        const password = user.password

        await User.create(user)

        const response = await client
            .post('/api/users/login')
            .json({ username: user.username, password: password })

        const data = response.response.body

        assert.equal(response.response.statusCode, 200)
        assert.isNotNull(data.token.token)
    })

    test('Validation Failed (Login details didnt meet validators requirements)', async ({
        assert,
        client,
    }) => {
        const user = await UserFactory.make()

        await User.create(user)

        const response = await client
            .post('/api/users/login')
            .json({ username: 's', password: '2' })

        assert.equal(response.response.statusCode, 400)
    })

    test('Invalid Credentials', async ({ assert, client }) => {
        await UserFactory.create()

        const response = await client
            .post('/api/users/login')
            .json({ username: 'User2', password: 'User123!' })

        assert.equal(response.response.statusCode, 403)
    })
})
