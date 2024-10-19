import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {
    try {
      // await User.create({ username: 'Joel', password: 'password1', admin: true })
      const users = await User.all()

      return users
    } catch (error) {
      console.log(error.message)
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    return { Request: 'Users Post Request Received' }
  }

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
