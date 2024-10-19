import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Flashcards extends BaseSchema {
  protected tableName = 'flashcards'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('question').notNullable()
      table.text('answer').notNullable()
      table.enu('difficulty', ['easy', 'medium', 'hard']).defaultTo('medium')
      table
        .integer('flashcard_set_id')
        .unsigned()
        .references('id')
        .inTable('flashcard_sets')
        .onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
