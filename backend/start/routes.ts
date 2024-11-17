/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { throttle } from './limiter.js'
import { middleware } from './kernel.js'

// Dynamic imports for HMR
const SetsController = () => import('#controllers/sets_controller')
const CommentsController = () => import('#controllers/comments_controller')
const UsersController = () => import('#controllers/users_controller')
const CardsController = () => import('#controllers/cards_controller')
const CollectionsController = () => import('#controllers/collections_controller')
const UserCollectionsController = () => import('#controllers/user_collections_controller')
const LimitsController = () => import('#controllers/limits_controller')
const AuthController = () => import('#controllers/auth_controller')

// Api Router Group
router
    .group(() => {
        router.get('/', async () => {
            return {
                hello: 'world',
            }
        })
        router.post('/users/register', [AuthController, 'register'])
        router.post('/users/login', [AuthController, 'login'])

        router.get('/users/:user_id/sets', [SetsController, 'userIndex'])
        router.get('/collections/random', [CollectionsController, 'indexRandom'])
        router.post('/users', [UsersController, 'store']).use(middleware.auth())
        router.post('/sets', [SetsController, 'store']).use(throttle).use(middleware.auth())
        router.post('sets/update-limit', [LimitsController, 'updateLimit']).use(middleware.auth())
        router.get('/sets/get-limit-info', [LimitsController, 'getLimitInfo'])

        router
            .resource('sets', SetsController)
            .apiOnly()
            .except(['store'])
            .use(['update', 'destroy'], middleware.auth())
        router
            .resource('set.comment', CommentsController)
            .only(['store'])
            .use('*', middleware.auth())
        router.resource('sets.cards', CardsController).only(['index'])
        router
            .resource('users', UsersController)
            .apiOnly()
            .except(['store'])
            .where('id', router.matchers.number())
            .use(['destroy', 'update'], middleware.auth())
        router
            .resource('collections', CollectionsController)
            .only(['index', 'store'])
            .use(['store'], middleware.auth())
        router
            .resource('users.collections', UserCollectionsController)
            .only(['index', 'show', 'update', 'destroy'])
            .use(['destroy', 'update'], middleware.auth())
    })
    .prefix('/api')
