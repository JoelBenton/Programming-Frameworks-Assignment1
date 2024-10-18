import { FlashcardFactory } from '#database/factories/flashcard_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class FlashcardSeeder extends BaseSeeder {
  public async run() {
    await FlashcardFactory.createMany(20)
  }
}
