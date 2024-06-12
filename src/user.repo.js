import crypto from 'crypto'
import bycryp from 'bcrypt'

import DBlocal from 'db-local'

const { Schema } = new DBlocal({ path: './db' })
const SALT_ROUNDS = 10

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true }, // el username podria ser unique desde la bd sin embargo por el momento lo validamos en el repositorio
  password: { type: String, required: true }
})

export class UserRepository {
  static async create({ username, password }) {
    //1. validate username por el momento así optional: zod
    Validation.username(username)
    Validation.password(password)

    // 2. asegurarnos que el username no exista
    const user = User.findOne({ username })
    if (user) throw new Error('username already exists')

    const id = crypto.randomUUID()
    const hashedPassword = await bycryp.hash(password, SALT_ROUNDS)

    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()

    return id

  }

  static async login({ username, password }) {
    //1. validate username por el momento así optional: zod
    Validation.username(username)
    Validation.password(password)

    // 2. asegurarnos que el username no exista
    const user = User.findOne({ username })
    if (user) throw new Error('el usuario no existe')

    const isValid = await bycryp.compare(password, user.password)
    if (!isValid) throw new Error('invalid password')

    return user
  }
}

class Validation {
  static username(username) {
    //1. validate username por el momento así optional: zod
    if (typeof username !== 'string') throw new Error('username must be a string')
    if (username.length < 3) throw new Error('username must be at least 3 characters')
  }

  static password(password) {
    if (typeof password !== 'string') throw new Error('password must be a string')
    if (password.length < 6) throw new Error('password must be at least 6 characters')
  }
}