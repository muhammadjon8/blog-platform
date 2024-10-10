import express from 'express'
import { login, signup } from '../controllers/AuthController'


const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

export default router