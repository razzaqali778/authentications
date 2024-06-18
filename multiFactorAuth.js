// multiFactorAuth.js
const express = require('express')
const bcrypt = require('bcrypt')
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const users = {} // In-memory user store

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)
  const secret = speakeasy.generateSecret()
  users[username] = { hashedPassword, secret: secret.base32 }
  qrcode.toDataURL(secret.otpauth_url, (err, data) => {
    res.json({ qrcode: data })
  })
})

app.post('/login', async (req, res) => {
  const { username, password, token } = req.body
  const user = users[username]
  if (user && (await bcrypt.compare(password, user.hashedPassword))) {
    const verified = speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'base32',
      token,
    })
    if (verified) {
      res.send('MFA authentication successful')
    } else {
      res.status(401).send('Invalid 2FA token')
    }
  } else {
    res.status(401).send('Invalid credentials')
  }
})

app.listen(3002, () => {
  console.log('MFA server running on port 3002')
})
