import { SALT_ROUNDS } from './config.js'

import crypto from 'crypto'
import bycrypt from 'bcrypt'

import DBlocal from 'db-local'

const { Schema } = new DBlocal({ path: './src/db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

export class UserRepository {
  static async create ({ username, password }) {
    // 1. Validaciones del username y password
    Validation.username(username)
    Validation.password(password)

    // 2. Asegurar que el username no exista
    const user = User.findOne({ username })
    if (user) throw new Error('Username already exists')

    const id = crypto.randomUUID()

    const hashPassword = await bycrypt.hash(password, SALT_ROUNDS) // hasSync bloquea el hilo de ejecución principal

    User.create(
      {
        _id: id,
        username,
        password: hashPassword
      }
    ).save()

    return { id }
  }

  static async login ({ username, password }) {
    // 1. Validaciones del username y password
    Validation.username(username)
    Validation.password(password)

    const user = User.findOne({ username })

    if (!user) throw new Error('User not found')

    const isValid = await bycrypt.compare(password, user.password)
    if (!isValid) throw new Error('Invalid password')

    const { password: _, ...publicUser } = user // podriamos usar la forma larga para quitar propiedades que no deseamos enviar

    return publicUser
  }
}

class Validation {
  static username (username) {
    // 1. Validaciones del username y password
    if (typeof username !== 'string') throw new Error('Username must be a string')
    if (username.length < 3) throw new Error('Username must be at least 4 characters')
  }

  static password (password) {
    if (typeof password !== 'string') throw new Error('Password must be a string')
    if (password.length < 6) throw new Error('Password must be at least 4 characters')
  }
}
