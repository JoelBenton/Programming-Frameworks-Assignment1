import { CommentFactory } from '#database/factories/comment_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class CommentSeeder extends BaseSeeder {
  public async run() {
    await CommentFactory.createMany(15)
  }
}
