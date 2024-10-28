import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Collection from '#models/collection'
import FlashcardSet from '#models/flashcard_set'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class CollectionSet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare comment: string

  @column()
  declare collectionId: number

  @column()
  declare flashcardSetId: number

  @belongsTo(() => FlashcardSet)
  declare flashcardSet: BelongsTo<typeof FlashcardSet>

  @belongsTo(() => Collection)
  declare collection: BelongsTo<typeof Collection>
}
