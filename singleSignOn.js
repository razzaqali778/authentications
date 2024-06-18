// singleSignOn.js
const express = require('express')
const passport = require('passport')
const SamlStrategy = require('passport-saml').Strategy
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(passport.initialize())

passport.use(
  new SamlStrategy(
    {
      path: '/login/callback',
      entryPoint: 'https://your-idp.com/saml/login',
      issuer: 'your-saml-issuer',
    },
    (profile, done) => {
      return done(null, profile)
    }
  )
)

app.get(
  '/login',
  passport.authenticate('saml', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
)

app.post(
  '/login/callback',
  passport.authenticate('saml', {
    failureRedirect: '/',
    failureFlash: true,
  }),
  (req, res) => {
    res.send('SSO Authentication successful')
  }
)

app.listen(3006, () => {
  console.log('Single Sign-On server running on port 3006')
})
