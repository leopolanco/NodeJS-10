require('./models/User')
require('./models/Tracks')
const express = require('express')
const connectDB = require('./db')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/authRoutes')
const trackRoutes = require('./routes/trackRoutes')
const requireAuth = require('./middleware/requireAuth')
const app = express()

require('dotenv').config()

connectDB(process.env.MONGO_URI)

app.use(bodyParser.json())
app.use(authRoutes)
app.use(trackRoutes)

app.get('/', requireAuth, (req, res) => {
  res.send(`Your email: ${req.user.email}`)
})

app.listen(1000, () => {
  console.log('Listening on port 1000')
})
