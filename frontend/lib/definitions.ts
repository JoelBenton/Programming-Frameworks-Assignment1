export type Credentials = {
  username: string,
  password: string,
}

export type CurrentUser = {
  id: number,
  username: string,
  admin: boolean,
  token: string,
}

export type SessionPayload = {
  user: CurrentUser,
  expires: Date
}

export type Flashcard = {
  id?: number,
  question: string,
  answer: string,
  difficulty: string
}

export type FlashcardSet = {
  id: number,
  name: string,
  user_id: number,
  cards: Flashcard[],
  created_at: Date,
  updated_at: Date
}

export type FlashcardCommentSet = {
  id: number,
  name: string,
  user_id: number,
  cards: Flashcard[],
  comments: Comment[],
  created_at: Date,
  updated_at: Date
}

export type User = {
  id: number,
  username: string,
  admin: boolean,
}

export type Comment = {
  comment: string,
  author: User,
}