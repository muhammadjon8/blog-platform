import express from 'express'
import {
  getUserProfile,
  login,
  signup,
  updateProfile,
  updateUserRole,
} from '../controllers/AuthController'
import { auth } from '../middlewares/auth.middleware'
import { checkAdmin } from '../middlewares/admin.guard'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/user/:userId/role', auth, checkAdmin, updateUserRole)
router.get('/profile', auth, getUserProfile)
router.patch("/update", auth, updateProfile)

export default router
