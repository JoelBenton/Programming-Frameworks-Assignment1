import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UserSeeder extends BaseSeeder {
    public async run() {
        const username = 'AdminUser'

        // Check if the user already exists
        const userExists = await User.query().where('username', username).first()

        if (!userExists) {
            // Create the user if they don't exist
            await User.create({
                username,
                password: 'Admin123!',
                admin: true,
            })
            console.log(`User '${username}' created successfully.`)
        } else {
            console.log(`User '${username}' already exists.`)
        }
    }
}
