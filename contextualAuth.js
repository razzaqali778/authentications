// contextualAuth.js
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const users = {} // In-memory user store

app.post('/register', (req, res) => {
  const { username, password, device, location } = req.body
  users[username] = { password, device, location }
  res.send('User registered successfully')
})

app.post('/login', (req, res) => {
  const { username, password, device, location } = req.body
  const user = users[username]
  if (
    user &&
    user.password === password &&
    user.device === device &&
    user.location === location
  ) {
    res.send('Contextual authentication successful')
  } else {
    res.status(401).send('Invalid credentials or context')
  }
})

app.listen(3009, () => {
  console.log('Contextual Authentication server running on port 3009')
})
