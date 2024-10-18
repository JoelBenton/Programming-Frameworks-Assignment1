import { BaseSchema } from '@adonisjs/lucid/schema'

export default class FlashcardSets extends BaseSchema {
  protected tableName = 'flashcard_sets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
