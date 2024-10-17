import type { HttpContext } from '@adonisjs/core/http'

export default class CollectionsController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {}

  /**
   * Redirect to a random resource
   */
  async indexRandom({ response }: HttpContext) {}
}
