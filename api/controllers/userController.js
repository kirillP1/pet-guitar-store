import catchAsyncErrors from '../middleware/catchAsyncErrors.js'
import User from '../models/userModel.js'
import ErrorHandler from '../utils/errorHandler.js'
import { sendToken } from '../utils/jwtToken.js'

export const registerUser = catchAsyncErrors(async (req, res, next) => {
	try {
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
	} catch (e) {
		next(new ErrorHandler(`${e}`, 400))
	}
})

export const loginUser = catchAsyncErrors(async (req, res, next) => {
	const { email, password } = req.body

	// checking if user has given password and email both
	if (!email || !password) {
		return next(new ErrorHandler('Please Enter Email & Password', 400))
	}

	const user = await User.findOne({ email }).select('+password')
	const isPasswordMatched = await user.comparePassword(password)

	if (!user || !isPasswordMatched) {
		return next(new ErrorHandler('Invalid email or password', 401))
	}

	sendToken(user, 201, res)
})
