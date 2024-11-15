import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Collections extends BaseSchema {
    protected tableName = 'collections'

    public async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('comment')
            table.dropColumn('flashcard_set_id')
            table.text('name')
        })
    }
}
