const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
})

//this function runs before the schema is saved to the db
userSchema.pre('save', function (next) {
  //we dont use an arrow function because the user is saved as this
  const user = this
  if (!user.isModified('password')) {
    return next()
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err)
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err)
      }
      user.password = hash
      //replace the password with the hashed+salted password
      next()
    })
  })
})

userSchema.methods.comparePassword = function (candidatePassword) {
  //we dont use an arrow function because the user is saved as this
  const user = this
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err)
      }
      if (!isMatch) {
        //password didn't match
        return reject(false)
      }
      //password did match
      return resolve(true)
    })
  })
}

//the reason we aren't exporting a module
//is because mongo expects model() to be called
//only once.
//If we export then the model() function will be called
//everytime the app starts
mongoose.model('User', userSchema)
