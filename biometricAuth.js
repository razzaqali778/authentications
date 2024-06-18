// biometricAuth.js
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const users = {} // In-memory user store

app.post('/register', (req, res) => {
  const { username, fingerprint } = req.body
  users[username] = { fingerprint }
  res.send('User registered successfully')
})

app.post('/login', (req, res) => {
  const { username, fingerprint } = req.body
  const user = users[username]
  if (user && user.fingerprint === fingerprint) {
    res.send('Biometric authentication successful')
  } else {
    res.status(401).send('Invalid fingerprint')
  }
})

app.listen(3003, () => {
  console.log('Biometric Authentication server running on port 3003')
})
