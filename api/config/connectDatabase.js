import mongoose from 'mongoose'

const connectDatabase = () => {
	mongoose
		.connect(process.env.MONGO)
		.then(() => console.log('Connected to MongoDB'))
		.catch(err => console.log(err))
}

export default connectDatabase
