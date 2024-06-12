import express from 'express';
import { UserRepository } from './user.repo.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  console.log(req.body);

  try {
    const id = UserRepository.create({ username, password });
    res.send({ id });
  } catch (error) {
    // normalmente no se enviaría el error directamente al cliente
    res.status(400).send({ error: error.message });
  }
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

