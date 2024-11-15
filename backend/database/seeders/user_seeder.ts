import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserSeeder extends BaseSeeder {
    public async run() {
        await User.create({
            username: 'AdminUser',
            password: 'Admin123!',
            admin: true,
        })
    }
}
