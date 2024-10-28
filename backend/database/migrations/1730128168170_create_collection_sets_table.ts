import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CollectionSets extends BaseSchema {
  protected tableName = 'collection_sets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('collection_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('collections')
        .onDelete('CASCADE')
      table
        .integer('flashcard_set_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('flashcard_sets')
        .onDelete('CASCADE')
      table.string('comment').notNullable()
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
