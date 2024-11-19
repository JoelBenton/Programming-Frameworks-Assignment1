import { UserFactory } from '#database/factories/user_factory'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('All Flashcard Sets list', (group) => {
    group.each.setup(() => testUtils.db().withGlobalTransaction())
    test('Get a list of all Flashcard Sets', async ({ assert, client }) => {
        const data = await UserFactory.with('flashcardSets', 2, (flashcardSet) => {
            flashcardSet.with('flashcards', 4)
        }).create()

        const response = await client.get('/api/sets')
        const ResponseData = JSON.parse(response.response.text).data

        assert.equal(ResponseData.length, 2)

        assert.equal(ResponseData[0].cards.length, 4)
        assert.equal(ResponseData[1].cards.length, 4)

        assert.equal(ResponseData[0].name, data.flashcardSets[0].name)
        assert.equal(ResponseData[1].name, data.flashcardSets[1].name)
    })
})
