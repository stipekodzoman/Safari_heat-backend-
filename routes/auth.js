import express from 'express'
import { login, register , logout } from '../Controllers/authController.js'
import { verifyToken } from '../utils/verifyToken.js'
import {sendVerifyCode, verifyEmail} from '../Controllers/emailVerify.js'
const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout',logout)
router.post('/sendEmail',sendVerifyCode)
router.post('/verifyEmail',verifyEmail)
router.post('/verify',verifyToken)
export default router