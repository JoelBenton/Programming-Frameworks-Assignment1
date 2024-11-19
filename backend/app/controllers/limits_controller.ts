import { limitValidator } from '#validators/limit'
import type { HttpContext } from '@adonisjs/core/http'
import Redis from '@adonisjs/redis/services/main'

const totalRequestsKey = 'global_total_requests'
const limitKey = 'global_daily_limit'

export default class LimitsController {
    // Update the daily creation limit
    public async updateLimit({ request, response, auth }: HttpContext) {
        try {
            const user = auth.getUserOrFail()

            if (user.admin !== true) {
                return response.unauthorized({ message: 'Unauthorized access' })
            }
            const data = request.all()

            const payload = await limitValidator.validate(data)

            const newLimit = payload.limit

            // Set new limit
            await Redis.set(limitKey, newLimit)

            return response.ok({ message: 'Daily limit updated', newLimit })
        } catch (error) {
            if (error.code === 'E_VALIDATION_ERROR') {
                return response.badRequest({
                    message: 'Data Validation failed / The limit could not be updated',
                    error: error.message,
                })
            } else {
                return response.internalServerError({
                    message: 'An error occurred while updating the limit',
                    error: error.message,
                })
            }
        }
    }

    // Retrieve the current limit
    public async getLimitInfo({ response }: HttpContext) {
        const limit = (await Redis.get('global_daily_limit')) || 0
        const totalRequests = Number(await Redis.get(totalRequestsKey)) || 0

        return response.ok({
            limit: limit,
            totalRequests: totalRequests,
        })
    }
}
