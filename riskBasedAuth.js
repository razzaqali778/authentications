// riskBasedAuth.js
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const users = {} // In-memory user store
const highRiskIPs = ['192.168.1.1'] // Example of high-risk IPs

app.post('/register', (req, res) => {
  const { username, password } = req.body
  users[username] = { password }
  res.send('User registered successfully')
})

app.post('/login', (req, res) => {
  const { username, password, ip } = req.body
  const user = users[username]
  if (user && user.password === password) {
    if (highRiskIPs.includes(ip)) {
      res.status(401).send('Login from high-risk IP detected')
    } else {
      res.send('Risk-based authentication successful')
    }
  } else {
    res.status(401).send('Invalid credentials')
  }
})

app.listen(3008, () => {
  console.log('Risk-Based Authentication server running on port 3008')
})
