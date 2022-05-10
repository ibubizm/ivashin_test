const Router = require('express')
const router = new Router()
const AuthController = require('../controllers/authController')
const { check } = require('express-validator')

router.post(
  '/registration',
  [
    check('email', 'email не может быть пустым').notEmpty(),
    check('password', 'В пароле должно быть больше 4 семволов').isLength({
      min: 4,
    }),
    check('firstName', 'Имя не может быть пустым').notEmpty(),
    check('lastName', 'фамилия не может быть пустым').notEmpty(),
  ],
  AuthController.registration
)
router.post('/login', AuthController.login)

module.exports = router
