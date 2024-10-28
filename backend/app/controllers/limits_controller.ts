import { limitValidator } from '#validators/limit'
import type { HttpContext } from '@adonisjs/core/http'
import Redis from '@adonisjs/redis/services/main'

const totalRequestsKey = 'global:total_requests'
const limitKey = 'global_daily_limit'

export default class LimitsController {
  // Update the daily creation limit
  public async updateLimit({ request, response }: HttpContext) {
    try {
      const data = request.all()

      const payload = await limitValidator.validate(data)

      const newLimit = payload.limit

      // Set new limit
      await Redis.set(limitKey, newLimit)

      return response.ok({ message: 'Daily limit updated', newLimit })
    } catch (error) {
      if (error.code === 'E_VALIDATION_FAILURE') {
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
  public async getLimit({ response }: HttpContext) {
    const limit = (await Redis.get('global_daily_limit')) || 20
    return response.ok({ limit })
  }

  // Retrieve remaining requests
  public async getRemainingRequests({ response }: HttpContext) {
    const totalRequests = Number(await Redis.get(totalRequestsKey))
    const limit = Number(await Redis.get(limitKey))

    const remainingRequests = limit - totalRequests

    return response.ok({ remainingRequests: remainingRequests })
  }
}
