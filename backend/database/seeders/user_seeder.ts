import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UserFactory } from '#database/factories/user_factory'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await UserFactory.createMany(10) // If Number is changed. Update factories to reflect it.
  }
}
