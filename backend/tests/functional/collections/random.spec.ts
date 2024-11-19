import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('random collection', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    test('Successful Get a random collection URL', async ({ assert, client }) => {
        const data = await UserFactory.with('collections', 1, (collection) => {
            collection.with('sets', 1, (collectionSet) => {
                collectionSet.with('flashcardSet', 1, (flashcardSet) => {
                    flashcardSet.with('flashcards', 1).with('user', 1)
                })
            })
        }).create()
        const response = await client.get('/api/collections/random')

        assert.equal(response.response.statusCode, 200)
        assert.equal(response.response.body.url, `/collections/${data.collections[0].id}`)
    })

    test('No Collections found', async ({ assert, client }) => {
        const response = await client.get('/api/collections/random')
        assert.equal(response.response.statusCode, 404)
    })
})
