import { Router } from 'express'
import productRouter from './productRoute.js'

const indexRouter = new Router()

indexRouter.use('/product', productRouter)

export default indexRouter
