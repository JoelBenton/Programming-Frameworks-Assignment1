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

export type flashcard = {
  id: number,
  name: string,
  user_id: number,
  cards: {
    id: number,
    question: string,
    answer: string,
    difficulty: string
  }[],
  created_at: Date
  updated_at: Date
}

export type User = {
  id: number,
  username: string,
  admin: boolean,
}