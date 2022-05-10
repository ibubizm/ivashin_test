const User = require('../models/User')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const path = require('path')
const jwt = require('jsonwebtoken')
const { secret } = require('../config')
const { validationResult } = require('express-validator')

const generateAccessToken = (id) => {
  const payload = {
    id,
  }
  return jwt.sign(payload, secret, { expiresIn: '24h' })
}

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: 'ошибка при регистрации error', errors })
      }
      const { email, password, firstName, lastName } = req.body
      const { image } = req.files
      let fileName = uuid.v4() + '.jpg'
      image.mv(path.resolve(__dirname, '..', 'static', fileName))

      const candidate = await User.findOne({ email })

      if (candidate) {
        return res.status(400).json({ message: 'user already exist' })
      }
      const hashPassword = bcrypt.hashSync(password, 4)
      const user = new User({
        email,
        password: hashPassword,
        firstName,
        lastName,
        image: fileName,
      })
      await user.save()
      return res.json({ message: 'user created' })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ message: 'registration error' })
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }

      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) {
        return res.status(400).json({ message: 'Неверный логин или пароль' })
      }

      const token = generateAccessToken(user._id)
      return res.json({ token })
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'login error' })
    }
  }
}

module.exports = new AuthController()
