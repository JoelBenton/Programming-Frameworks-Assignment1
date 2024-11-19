import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Search for Collection', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    test('Successful deletion of a specific collection', async ({ assert, client }) => {
        const data = await UserFactory.with('collections', 1, (collection) => {
            collection.with('sets', 1, (collectionSet) => {
                collectionSet.with('flashcardSet', 1, (flashcardSet) => {
                    flashcardSet.with('flashcards', 1).with('user', 1)
                })
            })
        }).create()

        const response = await client
            .delete(
                `/api/users/${data.collections[0].userId}/collections/${data.collections[0].id}`
            )
            .loginAs(data)

        assert.equal(response.response.statusCode, 204)
    })

    test('Different User trying to delete someone elses collection', async ({ assert, client }) => {
        const user = await UserFactory.merge({ admin: false }).create()
        const data = await UserFactory.with('collections', 1, (collection) => {
            collection.with('sets', 1, (collectionSet) => {
                collectionSet.with('flashcardSet', 1, (flashcardSet) => {
                    flashcardSet.with('flashcards', 1).with('user', 1)
                })
            })
        }).create()

        const response = await client
            .delete(
                `/api/users/${data.collections[0].userId}/collections/${data.collections[0].id}`
            )
            .loginAs(user)

        assert.equal(response.response.statusCode, 403)
    })

    test('Unathorised Request (Aka no Auth provided)', async ({ assert, client }) => {
        const response = await client.delete(`/api/users/0/collections/0`)

        assert.equal(response.response.statusCode, 401)
    })

    test('Collection Not Found', async ({ assert, client }) => {
        const response = await client.get(`/api/users/-1/collections/-1`)

        assert.equal(response.response.statusCode, 404)
    })
})
