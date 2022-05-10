const { Binary } = require('bson')
const { Schema, model } = require('mongoose')

const User = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  image: { type: String, default: null },
  pdf: { type: Buffer, default: null },
})

module.exports = model('User', User)
