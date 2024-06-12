import { UserRepository } from './user.repository.js'
import { PORT } from './config.js'
import express from 'express'

const app = express()

app.set('view engine', 'ejs')
app.use(express.json())

app.get('/', (req, res) => {
  res.render('example', { name: 'World' })
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
    res.status(200).json(user)
  } catch (error) {
    res.status(401).send({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
