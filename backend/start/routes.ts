/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const SetsController = () => import('#controllers/sets_controller')
const CommentsController = () => import('#controllers/comments_controller')
const UsersController = () => import('#controllers/users_controller')
const CardsController = () => import('#controllers/cards_controller')
const CollectionsController = () => import('#controllers/collections_controller')
const UserCollectionsController = () => import('#controllers/user_collections_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/users/:user_id/sets', '#controllers/sets_controller.userIndex')
router.get('/collections/random', '#controllers/collections_controller.indexRandom')

router.resource('sets', SetsController).apiOnly()
router.resource('sets.comment', CommentsController).only(['store'])
router.resource('sets.cards', CardsController).only(['index'])
router.resource('users', UsersController).apiOnly()
router.resource('collections', CollectionsController).only(['index', 'store'])
router
  .resource('users.collections', UserCollectionsController)
  .only(['index', 'show', 'update', 'destroy'])
