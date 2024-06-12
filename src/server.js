import { UserRepository } from './user.repo.js';
import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  console.log(req.body);

  try {
    const id = await UserRepository.create({ username, password });
    res.send({ id });
  } catch (error) {
    // normalmente no se enviaría el error directamente al cliente
    res.status(400).send({ error: error.message });
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserRepository.login({ username, password });
    res.send({ user });
  } catch (error) {
    res.status(401).send({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

