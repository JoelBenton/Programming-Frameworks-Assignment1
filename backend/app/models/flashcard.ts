import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import FlashcardSet from '#models/flashcard_set'
import { DateTime } from 'luxon'

export default class Flashcard extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare question: string

    @column()
    declare answer: string

    @column()
    declare difficulty: string

    @column()
    declare flashcardSetId: number

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @belongsTo(() => FlashcardSet)
    declare flashcardSet: BelongsTo<typeof FlashcardSet>
}
