// twoFactorAuth.js
const express = require('express')
const bodyParser = require('body-parser')
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')

const app = express()
app.use(bodyParser.json())

const users = {} // In-memory user store

app.post('/register', (req, res) => {
  const { username } = req.body
  const secret = speakeasy.generateSecret()
  users[username] = { secret: secret.base32 }
  qrcode.toDataURL(secret.otpauth_url, (err, data) => {
    res.json({ secret: secret.base32, qrcode: data })
  })
})

app.post('/verify', (req, res) => {
  const { username, token } = req.body
  const secret = users[username].secret
  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
  })
  if (verified) {
    res.send('2FA verification successful')
  } else {
    res.status(401).send('Invalid token')
  }
})

app.listen(3001, () => {
  console.log('2FA server running on port 3001')
})
