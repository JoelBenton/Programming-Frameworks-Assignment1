import { CollectionFactory } from '#database/factories/collection_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class CollectionSeeder extends BaseSeeder {
  public async run() {
    await CollectionFactory.createMany(10)
  }
}
