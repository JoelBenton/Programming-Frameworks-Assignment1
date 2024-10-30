import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { usersValidator } from '#validators/user'
import { isAdmin } from '#policies/main'

function returnUserData(userData: User) {
  return {
    id: userData.id,
    username: userData.username,
    admin: Boolean(userData.admin),
  }
}

export default class UsersController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    try {
      // Fetch all users from the database
      const users = await User.all()

      // Map the users to include only the desired fields
      const userList = users.map((user) => returnUserData(user))

      // Return a structured response with a 200 status code
      return response.ok({
        message: 'Users retrieved successfully',
        data: userList,
      })
    } catch (error) {
      // Return a 500 Internal Server Error response
      return response.internalServerError({
        message: 'An error occurred while retrieving users',
        error: error.message,
      })
    }
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response, bouncer }: HttpContext) {
    try {
      // Get all request data
      const data = request.all()

      // Validate the data using the validator
      const payload = await usersValidator.validate(data)

      if (!(await bouncer.allows(isAdmin)) && Boolean(payload.admin) === true) {
        return response.forbidden({ message: 'User not Authenticated for this action!' })
      }

      // Create the user in the database
      const user = await User.create(payload)

      // Return a response with the created user details
      return response.created({
        message: 'User Created',
        data: returnUserData(user),
      })
    } catch (error) {
      // Handle validation errors and other potential errors
      if (error.code === 'E_VALIDATION_ERROR') {
        return response.badRequest({
          message: 'Data Validation failed / The user could not be created',
          error: error.message,
        })
      }

      // Handle any other errors
      return response.internalServerError({
        message: 'An error occurred while creating the user',
        error: error.message,
      })
    }
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const id = params.id

    try {
      const user = await User.findOrFail(id)
      return response.ok({
        message: 'User found',
        data: returnUserData(user),
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'The user was not found',
          error: error.message,
        })
      }

      // Handle any other errors
      return response.internalServerError({
        message: 'An error occurred while creating the user',
        error: error.message,
      })
    }
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response, bouncer, auth }: HttpContext) {
    const id = params.id

    try {
      const authUser = auth.getUserOrFail()

      if (authUser.id !== id && !authUser.admin) {
        return response.forbidden({ message: 'User not Authenticated for this action!' })
      }

      const data = request.all()
      const payload = await usersValidator.validate(data)

      // Find the user by ID
      const user = await User.findOrFail(id)

      // Update the user fields with validated data
      user.username = payload.username
      user.password = payload.password
      if (payload.admin) {
        if (await bouncer.allows(isAdmin)) {
          user.admin = payload.admin
        } else {
          return response.forbidden({ message: 'User not Authenticated for this action!' })
        }
      }

      // Save the updated user
      await user.save()

      return response.ok({
        message: 'User updated successfully',
        data: {
          id: user.id,
          username: user.username,
          admin: user.admin,
        },
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({
          message: 'No user found with that ID',
          error: error.message,
        })
      }

      // Handle validation errors
      if (error.code === 'E_VALIDATION_ERROR') {
        return response.badRequest({
          message: 'Data Validation failed',
          errors: error.message,
        })
      }

      // Handle any other errors
      return response.internalServerError({
        message: 'An error occurred while updating the user',
        error: error.message,
      })
    }
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const id = params.id

    try {
      const user = await User.findOrFail(id)
      user.delete()
      return response.created({
        message: 'User Deleted',
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.forbidden({
          message: 'No User with that ID.',
          error: error.message,
        })
      }

      // Handle any other errors
      return response.internalServerError({
        message: 'An error occurred while deleting the user',
        error: error.message,
      })
    }
  }
}
