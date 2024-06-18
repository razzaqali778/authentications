// tokenBasedAuth.js
const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const users = {} // In-memory user store
const secretKey = 'your-secret-key'

app.post('/register', (req, res) => {
  const { username, password } = req.body
  users[username] = { password }
  res.send('User registered successfully')
})

app.post('/login', (req, res) => {
  const { username, password } = req.body
  const user = users[username]
  if (user && user.password === password) {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' })
    res.json({ token })
  } else {
    res.status(401).send('Invalid credentials')
  }
})

app.get('/protected', (req, res) => {
  const token = req.headers['authorization']
  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        res.status(401).send('Invalid token')
      } else {
        res.send('Protected content')
      }
    })
  } else {
    res.status(401).send('No token provided')
  }
})

app.listen(3004, () => {
  console.log('Token-Based Authentication server running on port 3004')
})
