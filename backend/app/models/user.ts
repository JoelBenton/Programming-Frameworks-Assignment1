import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import FlashcardSet from '#models/flashcard_set'
import Comment from '#models/comment'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['username'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column({ serializeAs: null })
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

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
