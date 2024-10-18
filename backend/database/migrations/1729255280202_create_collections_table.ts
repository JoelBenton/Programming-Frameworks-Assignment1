import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Collections extends BaseSchema {
  protected tableName = 'collections'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('comment')
      table
        .integer('flashcard_set_id')
        .unsigned()
        .references('id')
        .inTable('flashcard_sets')
        .onDelete('CASCADE')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
