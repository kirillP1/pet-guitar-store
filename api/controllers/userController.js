import catchAsyncErrors from '../middleware/catchAsyncErrors.js'
import User from '../models/userModel.js'
import ErrorHandler from '../utils/errorHandler.js'

export const registerUser = catchAsyncErrors(async (req, res) => {
	const { name, email, password } = req.body

	// Register new User
	const user = await User.create({
		name,
		email,
		password,
		avatar: {
			public_id: 'this is a sample id',
			url: 'profilePicUrl',
		},
	})

	const token = user.getJWTToken()

	res.status(201).json({
		success: true,
		user,
		token,
	})
})

export const loginUser = catchAsyncErrors(async (req, res, next) => {
	const { email, password } = req.body

	// checking if user has given password and email both
	if (!email || !password) {
		return next(new ErrorHandler('Please Enter Email & Password', 400))
	}
})
