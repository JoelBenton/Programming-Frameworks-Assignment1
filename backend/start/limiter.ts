/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes. Feel free to define as many
| throttle middleware as needed.
|
*/

import Redis from '@adonisjs/redis/services/main'
import limiter from '@adonisjs/limiter/services/main'

// Utility to calculate time remaining until midnight (in seconds)
function timeUntilMidnight() {
    const now = new Date()
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    return Math.floor((midnight.getTime() - now.getTime()) / 1000) // Convert milliseconds to seconds
}

export const throttle = limiter.define('api', async () => {
    const totalRequestsKey = 'global_total_requests'
    const limitKey = 'global_daily_limit'

    // // Fetch the current total requests count from Redis
    let totalRequests = await Redis.get(totalRequestsKey)

    if (!totalRequests) {
        await Redis.set(totalRequestsKey, 0)
        await Redis.expire(totalRequestsKey, timeUntilMidnight()) // Set to expire at midnight
        totalRequests = '0'
    }

    // Fetch the maximum requests per day from Redis
    let MAX_REQUESTS_PER_DAY = Number(await Redis.get(limitKey))

    if (!MAX_REQUESTS_PER_DAY || MAX_REQUESTS_PER_DAY === 0) {
        MAX_REQUESTS_PER_DAY = 20
        await Redis.set(limitKey, MAX_REQUESTS_PER_DAY) // Set the limit in Redis
    } else {
        MAX_REQUESTS_PER_DAY = Number(MAX_REQUESTS_PER_DAY)
    }

    // Allow requests for the current middleware
    return limiter.allowRequests(20).every(1)
})
