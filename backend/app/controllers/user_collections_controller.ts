import type { HttpContext } from '@adonisjs/core/http'

export default class UserCollectionsController {
  /**
   * Display a list of resource
   */
  async index({params, response }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
