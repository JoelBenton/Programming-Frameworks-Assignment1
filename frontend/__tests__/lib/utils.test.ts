import { sleep } from '@/lib/utils'

describe('sleep', () => {
    test('resolves after a specified amount of milliseconds', async () => {
        const start = Date.now()
        await sleep(100)
        const end = Date.now()
        expect(end - start).toBeGreaterThanOrEqual(100)
    })
})