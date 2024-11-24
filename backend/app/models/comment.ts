import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import FlashcardSet from '#models/flashcard_set'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Comment extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare comment: string

    @column()
    declare rating: number

    @column()
    declare flashcardSetId: number

    @column()
    declare userId: number

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @belongsTo(() => FlashcardSet)
    declare flashcardSet: BelongsTo<typeof FlashcardSet>

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>
}
