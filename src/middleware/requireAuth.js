const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model('User')
require('dotenv').config()

module.exports = (req, res, next) => {
  //pull the authorization header
  const { authorization } = req.headers
  //authorization === 'Bearer iasjdthjthasdas'
  if (!authorization) {
    return res.status(401).send({ error: ' You must be logged in' })
  }

  const token = authorization.replace('Bearer ', '')
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
    console.error(err.message)
      return res.status(401).send({ error: 'You must be logged in' })
    }
    const { userId } = payload
    //find user and continue the script
    const user = await User.findById(userId)
    req.user = user
    next()
  })
}
