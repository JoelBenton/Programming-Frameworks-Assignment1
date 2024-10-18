import { FlashcardSetFactory } from '#database/factories/flashcard_set_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class FlashcardSetSeeder extends BaseSeeder {
  public async run() {
    await FlashcardSetFactory.createMany(5) // If Number is changed. Update factories to reflect it.
  }
}
