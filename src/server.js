import { UserRepository } from './user.repository.js'
import { PORT, SECRET_JWT_KEY } from './config.js'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import express from 'express'

const app = express()

app.set('view engine', 'ejs')
app.use(express.json())
app.disable('x-powered-by')
app.use(cookieParser())

app.use((req, res, next) => {
  const token = req.cookies.access_token
  req.sesion = { user: null }

  try {
    const data = jwt.verify(token, SECRET_JWT_KEY)
    req.session.user = data
  } catch (error) {}

  next()
})

app.get('/', (req, res) => {
  const { user } = req.session
  res.render('index', { user })
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  try {
    const id = await UserRepository.create({ username, password })
    res.status(200).json(id)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET_JWT_KEY, { expiresIn: '1h' })
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 1
      })
      .status(200).json(user)
  } catch (error) {
    res.status(401).send({ error: error.message })
  }
})

app.get('/me', async (req, res) => {
  const token = req.cookies.access_token
  if (!token) {
    return res.status(403).send({ error: 'no token sorry' })
  }

  try {
    const user = jwt.verify(token, SECRET_JWT_KEY)
    res.status(200).json(user)
  } catch (error) {
    res.status(401).send({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
