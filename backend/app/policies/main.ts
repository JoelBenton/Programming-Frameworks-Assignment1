import User from '#models/user'
import { Bouncer } from '@adonisjs/bouncer'

export const isAdmin = Bouncer.ability((user: User) => {
    return Boolean(user.admin) === true
})

export const policies = {}
