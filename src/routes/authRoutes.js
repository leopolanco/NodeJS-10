const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = mongoose.model('User')
require('dotenv').config()

const router = express.Router()

//Register a user
router.post('/signup', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = new User({ email, password })
    await user.save()
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
    //this is what is sent if the endpoint is succesfully hitted
    res.send({ token })
  } catch (err) {
    console.error(err.message)
    return res.status(500).send('Server error')
  }
})

//login a user
router.post('/signin', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(422).send({ error: 'Must provide email or password' })
  }
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(404).send({ error: 'Invalid password or email' })
  }

  try {
    //compare the password given with the password registered with the user
    await user.comparePassword(password)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
    res.send({ token })
  } catch (err) {
    return res.status(422).send({ error: 'Invalid password or email' })
  }
})

module.exports = router
