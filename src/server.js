import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
})

app.post('/register', (req, res) => {
  const { username, password } = req.body;
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

