import type { HttpContext } from '@adonisjs/core/http'
import { loginValidator, registerValidator } from '#validators/auth'
import User from '#models/user'

export default class AuthController {
    async register({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(registerValidator)

            const user = await User.create(payload)
            return response.created(user)
        } catch (error) {
            if (error.code === 'E_VALIDATION_ERROR') {
                return response.forbidden({ message: 'Validation failed', errors: error.messages })
            }
            return response.internalServerError({
                message: 'Registration failed',
                error: error.message,
            })
        }
    }

    async login({ request, response }: HttpContext) {
        try {
            const { username, password } = await request.validateUsing(loginValidator)

            const user = await User.verifyCredentials(username, password)
            if (!user) {
                return response.forbidden({ message: 'Invalid credentials' })
            }

            const token = await User.accessTokens.create(user)

            return response.ok({
                token: token,
                ...user.serialize(),
            })
        } catch (error) {
            if (error.code === 'E_VALIDATION_ERROR') {
                return response.badRequest({ message: 'Validation failed', errors: error.messages })
            } else if (error.code === 'E_INVALID_CREDENTIALS') {
                return response.forbidden({ message: 'Invalid credentials', error: error.message })
            }
            return response.internalServerError({ message: 'Login failed', error: error.message })
        }
    }

    async logout({ auth, response }: HttpContext) {
        try {
            const user = await auth.getUserOrFail()
            const token = auth.user?.currentAccessToken.identifier

            if (!token) {
                return response.unauthorized({ message: 'User not logged in' })
            }

            await User.accessTokens.delete(user, token)
            return response.ok({ message: 'Logged out' })
        } catch (error) {
            if (error.code === 'E_UNAUTHORIZED_ACCESS') {
                return response.unauthorized({ message: 'User not logged in' })
            }
            return response.internalServerError({ message: 'Logout failed', error: error.message })
        }
    }
}
