import dotenv from 'dotenv'
import express from 'express'
import connectDatabase from './config/connectDatabase.js'
import errorMiddleware from './middleware/errorMiddleware.js'
import indexRouter from './routes/indexRoute.js'

// Handling Uncaught Exception
// process.on('uncaughtException', err => {
// 	console.log(`Error: ${err.message}`)
// 	console.log(`Shutting down the server due to Uncaught Exception`)
// 	process.exit(1)
// })

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

// Unhandled Promise Rejection
// process.on('unhandledRejection', err => {
// 	console.log(`Error: ${err.message}`)
// 	console.log(`Shutting down the server due to Unhandled Promise Rejection`)

// 	server.close(() => {
// 		process.exit(1)
// 	})
// })

export { app }
