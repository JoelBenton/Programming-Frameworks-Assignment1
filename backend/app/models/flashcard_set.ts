import { BaseModel, column, belongsTo, hasMany, scope } from '@adonisjs/lucid/orm'
import Flashcard from '#models/flashcard'
import User from '#models/user'
import Comment from '#models/comment'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class FlashcardSet extends BaseModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare name: string

    @column()
    declare userId: number

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime

    @belongsTo(() => User)
    declare user: BelongsTo<typeof User>

    @hasMany(() => Flashcard)
    declare flashcards: HasMany<typeof Flashcard>

    @hasMany(() => Comment)
    declare comments: HasMany<typeof Comment>

    public static userId = scope((query, userId: number) => {
        query.where('userId', userId)
    })
}
