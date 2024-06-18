// passwordBased.js
const express = require('express')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const users = {} // In-memory user store

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  users[username] = hashedPassword
  res.send('User registered successfully')
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const hashedPassword = users[username]
  if (hashedPassword && (await bcrypt.compare(password, hashedPassword))) {
    res.send('Login successful')
  } else {
    res.status(401).send('Invalid credentials')
  }
})

app.listen(3000, () => {
  console.log('Password-Based Authentication server running on port 3000')
})
