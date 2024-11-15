import factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import { DateTime } from 'luxon'
export const UserFactory = factory
    .define(User, async ({ faker }) => {
        return {
            username: faker.internet.userName(),
            password: faker.internet.password(),
            admin: faker.datatype.boolean(),
            created_at: DateTime.fromJSDate(faker.date.past()),
            updated_at: DateTime.fromJSDate(faker.date.recent()),
        }
    })
    .build()
