import type { HttpContext } from '@adonisjs/core/http'

export default class SetsController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}

  /**
   * Display a list of resource for user ID.
   */
  async userIndex({ params, response }: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {}
}
