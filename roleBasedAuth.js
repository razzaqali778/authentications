// roleBasedAuth.js
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const users = {} // In-memory user store

const roles = {
  admin: ['read', 'write', 'delete'],
  user: ['read'],
}

app.post('/register', (req, res) => {
  const { username, password, role } = req.body
  if (roles[role]) {
    users[username] = { password, role }
    res.send('User registered successfully')
  } else {
    res.status(400).send('Invalid role')
  }
})

app.post('/login', (req, res) => {
  const { username, password } = req.body
  const user = users[username]
  if (user && user.password === password) {
    res.json({ role: user.role, permissions: roles[user.role] })
  } else {
    res.status(401).send('Invalid credentials')
  }
})

app.listen(3010, () => {
  console.log('Role-Based Authentication server running on port 3010')
})
