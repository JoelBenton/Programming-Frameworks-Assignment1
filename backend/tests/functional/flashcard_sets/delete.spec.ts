import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Delete Flashcard Sets', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    test('Successful Delete of a Flashcard Set', async ({ assert, client }) => {
        const CreatedData = await UserFactory.with('flashcardSets', 1).create()

        const response = await client
            .delete(`/api/sets/${CreatedData.flashcardSets[0].id}`)
            .loginAs(CreatedData)

        assert.equal(response.response.statusCode, 204)
    })

    test('Unauthorised Delete of a Flashcard Set from a different user', async ({
        assert,
        client,
    }) => {
        const user = await UserFactory.merge({ admin: false }).create()
        const CreatedData = await UserFactory.with('flashcardSets', 1, (flashcardSet) => {
            flashcardSet
                .with('comments', 1, (comment) => {
                    comment.with('user')
                })
                .with('flashcards', 1)
        }).create()

        const response = await client
            .delete(`/api/sets/${CreatedData.flashcardSets[0].id}`)
            .loginAs(user)

        assert.equal(response.response.statusCode, 401)
    })

    test('Unauthorised Client Request', async ({ assert, client }) => {
        const response = await client.delete(`/api/sets/-1`)

        assert.equal(response.response.statusCode, 401)
    })

    test('Not found Client Request', async ({ assert, client }) => {
        const user = await UserFactory.create()

        const response = await client.delete(`/api/sets/-1`).loginAs(user)

        assert.equal(response.response.statusCode, 404)
    })
})
