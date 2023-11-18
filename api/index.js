import dotenv from 'dotenv'
import express from 'express'
import connectDatabase from './config/connectDatabase.js'
import errorMiddleware from './middleware/errorMiddleware.js'
import indexRouter from './routes/indexRoute.js'

// Connecting ENV constants
dotenv.config()

// Connecting to MongoDB
connectDatabase()

// Creating an instance of the Express application
const app = express()

// Connecting Routes
app.use('/api', indexRouter)

// Middleware for Errors
app.use(errorMiddleware)

// Starting the server
app.listen(process.env.PORT, () => {
	console.log(`Server is running on PORT = ${process.env.PORT}`)
})
