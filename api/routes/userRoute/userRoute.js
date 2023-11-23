import { Router } from 'express'
import { loginUser, registerUser } from '../../controllers/userController.js'

const userRouter = new Router()

// User enter and exit
userRouter.route('/register').post(registerUser)
userRouter.route('/login').post(loginUser)
userRouter.route('/logout').get()

// User account
userRouter.route('/me').get()
userRouter.route('/me/update').put()

// Password functions
userRouter.route('/password/forgot').post()
userRouter.route('/password/reset/:token').put()
userRouter.route('/password/update').put()

// Admin users
userRouter.route('/admin/users').get()
userRouter.route('/admin/user').get().put().delete()

export default userRouter
