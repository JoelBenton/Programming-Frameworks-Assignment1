// app/Models/User.ts
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import FlashcardSet from '#models/flashcard_set'
import Comment from '#models/comment'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import encryption from '@adonisjs/core/services/encryption'
import { DateTime } from 'luxon'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column({
    prepare: (value: string | null) => (value ? encryption.encrypt(value) : null),
    consume: (value: string | null) => (value ? encryption.decrypt(value) : null),
  })
  declare password: string

  @column()
  declare admin: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => FlashcardSet)
  declare flashcardSets: HasMany<typeof FlashcardSet>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>
}
