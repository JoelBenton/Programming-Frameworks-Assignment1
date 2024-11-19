import factory from '@adonisjs/lucid/factories'
import Collection from '#models/collection'
import { UserFactory } from './user_factory.js'
import { CollectionSetFactory } from './collection_set_factory.js'

export const CollectionFactory = factory
    .define(Collection, async ({ faker }) => {
        return {
            name: faker.lorem.words(2),
        }
    })
    .relation('user', () => UserFactory)
    .relation('sets', () => CollectionSetFactory)
    .build()
