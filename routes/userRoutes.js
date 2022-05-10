const Router = require('express')
const router = new Router()
const UserContraoller = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/users', authMiddleware, UserContraoller.getAll)
router.put('/users', authMiddleware, UserContraoller.update)
router.delete('/users', authMiddleware, UserContraoller.delete)
router.post('/users/pdf', authMiddleware, UserContraoller.makePdf)

module.exports = router
