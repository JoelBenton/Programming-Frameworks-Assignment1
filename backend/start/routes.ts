/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

// Dynamic imports for HMR
const SetsController = () => import('#controllers/sets_controller')
const CommentsController = () => import('#controllers/comments_controller')
const UsersController = () => import('#controllers/users_controller')
const CardsController = () => import('#controllers/cards_controller')
const CollectionsController = () => import('#controllers/collections_controller')
const UserCollectionsController = () => import('#controllers/user_collections_controller')

router
  .group(() => {
    router.get('/', async () => {
      return {
        hello: 'world',
      }
    })

    // Dynamic import for each route
    router.get('/users/:user_id/sets', async (ctx) => {
      const { default: SetController } = await SetsController()
      return new SetController().userIndex(ctx)
    })

    router.get('/collections/random', async (ctx) => {
      const { default: CollectionController } = await CollectionsController()
      return new CollectionController().indexRandom(ctx)
    })

    router.post('/users', async (ctx) => {
      const { default: UserController } = await UsersController()
      return new UserController().store(ctx)
    })

    // Use dynamic imports with router.resource API
    router.resource('sets', SetsController).apiOnly()
    router.resource('sets.comment', CommentsController).only(['store'])
    router.resource('sets.cards', CardsController).only(['index'])
    router
      .resource('users', UsersController)
      .apiOnly()
      .except(['store'])
      .where('id', router.matchers.number())
    router.resource('collections', CollectionsController).only(['index', 'store'])
    router
      .resource('users.collections', UserCollectionsController)
      .only(['index', 'show', 'update', 'destroy'])
  })
  .prefix('/api')
