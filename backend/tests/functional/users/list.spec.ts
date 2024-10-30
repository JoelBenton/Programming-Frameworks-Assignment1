import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { ModelObject } from '@adonisjs/lucid/types/model'
import { test } from '@japa/runner'

test.group('Users list', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())
  test('Get a list of users', async ({ assert, client }) => {
    await UserFactory.createMany(5)

    // Fetch from the database to get the accurate structure with updated IDs and timestamps
    const dbUsers = await User.query().select('id', 'username', 'admin')
    const serializedUsers = dbUsers.map((user) => user.toJSON())

    const response = await client.get('/api/users')
    const ResponseData = JSON.parse(response.response.text).data

    // Sort both arrays by a consistent field, e.g., `id`, to ensure order
    serializedUsers.sort((a, b) => a.id - b.id)
    ResponseData.sort((a: ModelObject, b: ModelObject) => a.id - b.id)

    // Perform deep equality check
    assert.deepEqual(ResponseData, serializedUsers)
  })
})
