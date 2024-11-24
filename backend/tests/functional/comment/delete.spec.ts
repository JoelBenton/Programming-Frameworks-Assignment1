import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Delete a Flashcard Set Comment', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    test('Successful deletion of a comment', async ({ assert, client }) => {
        const data = await UserFactory.with('flashcardSets', 1, (flashcardSet) => {
            flashcardSet.with('comments', 1, (comment) => {
                comment.with('user')
            })
        }).create()

        const response = await client
            .delete(
                `/api/sets/${data.flashcardSets[0].id}/comment/${data.flashcardSets[0].comments[0].id}`
            )
            .loginAs(data)

        assert.equal(response.response.statusCode, 204)
    })

    test('Unauthorised Client Request', async ({ assert, client }) => {
        const response = await client.delete(`/api/sets/0/comment/0`)

        assert.equal(response.response.statusCode, 401)
    })

    test('Flashcard Set Not Found', async ({ assert, client }) => {
        const user = await UserFactory.create()

        const response = await client.delete(`/api/sets/0/comment/0`).loginAs(user)

        assert.equal(response.response.statusCode, 404)
    })
})
