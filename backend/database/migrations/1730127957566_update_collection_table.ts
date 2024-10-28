import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Collections extends BaseSchema {
  protected tableName = 'collections'

  public async up() {
    this.schema.dropTable(this.tableName)
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('name')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
