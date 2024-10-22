import express from 'express'
import { login, signup, updateUserRole } from '../controllers/AuthController'
import { auth } from '../middlewares/auth.middleware'
import { checkAdmin } from '../middlewares/admin.guard'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/user/:userId/role', auth, checkAdmin, updateUserRole)

export default router
