import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Users extends BaseSchema {
    protected tableName = 'users'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('username').notNullable().unique()
            table.string('password').notNullable()
            table.boolean('admin').defaultTo(false)
            table.timestamps(true, true)
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
