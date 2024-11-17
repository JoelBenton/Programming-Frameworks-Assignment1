import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Auth Register', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    test('Successful Registeration', async ({ assert, client }) => {
        const user = await UserFactory.make()

        const response = await client
            .post('/api/users/register')
            .json({ username: user.username, password: user.password })

        assert.equal(response.response.statusCode, 201)
        assert.equal(response.response.body.username, user.username)
    })

    test('User already exists', async ({ assert, client }) => {
        await UserFactory.merge({ username: 'User123' }).create()
        const user = await UserFactory.merge({ username: 'User123' }).make()

        const response = await client
            .post('/api/users/register')
            .json({ username: user.username, password: user.password })

        assert.equal(response.response.statusCode, 403)
        assert.containsSubset(response.response.body.errors[0], {
            message: 'The username has already been taken',
        })
    })

    test('Invalid User Credentials', async ({ assert, client }) => {
        const response = await client
            .post('/api/users/register')
            .json({ username: 'a', password: 'a' }) // Doesnt meet the validation requirements

        assert.equal(response.response.statusCode, 403)
    })
})
