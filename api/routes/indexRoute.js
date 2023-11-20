import express, { Router } from 'express'
import productRouter from './productRoute.js'
import userRouter from './userRoute.js'

const indexRouter = new Router()

// Use express.json() middleware to parse JSON request bodies
indexRouter.use(express.json())

// Compile all routers in one IndexRouter
indexRouter.use('/product', productRouter)
indexRouter.use('/user', userRouter)

export default indexRouter
