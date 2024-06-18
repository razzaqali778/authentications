// certificateBasedAuth.js
const express = require('express')
const https = require('https')
const fs = require('fs')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const users = {} // In-memory user store

app.post('/register', (req, res) => {
  const { username, certificate } = req.body
  users[username] = { certificate }
  res.send('User registered successfully')
})

app.post('/login', (req, res) => {
  const { username, certificate } = req.body
  const user = users[username]
  if (user && user.certificate === certificate) {
    res.send('Certificate-based authentication successful')
  } else {
    res.status(401).send('Invalid certificate')
  }
})

const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
}

https.createServer(options, app).listen(3005, () => {
  console.log('Certificate-Based Authentication server running on port 3005')
})
