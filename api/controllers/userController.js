import crypto from 'crypto'
import catchAsyncErrors from '../middleware/catchAsyncErrors.js'
import User from '../models/userModel.js'
import ErrorHandler from '../utils/errorHandler.js'
import { sendToken } from '../utils/jwtToken.js'
import { sendEmail } from '../utils/sendEmail.js'

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

export const logoutUser = catchAsyncErrors(async (req, res, next) => {
	res.cookie('token', null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	})

	res.status(200).json({
		success: true,
		massage: 'Logged Out',
	})
})

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email })

	if (!user) {
		return next(new ErrorHandler('User not found', 404))
	}

	// Get ResetPassword Token
	const resetToken = user.getResetPasswordToken()

	await user.save({ validateBeforeSave: false })

	const resetPasswordUrl = `${req.protocol}://${req.get(
		'host'
	)}/api/user/password/reset/${resetToken}`
	console.log(resetPasswordUrl)
	const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`

	try {
		await sendEmail({
			email: user.email,
			subject: 'E-commerce password reset',
			message,
		})

		res.status(200).json({
			success: true,
			message: `Email send to ${user.email} successfully`,
		})
	} catch (e) {
		user.resetPasswordToken = undefined
		user.resetPasswordExpire = undefined

		await user.save({ validateBeforeSave: false })

		return next(new ErrorHandler(e.message, 500))
	}
})

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
	// creating token hash
	const resetPasswordToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex')

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	})

	if (!user) {
		return next(
			new ErrorHandler(
				'Reset Password Token is invalid or has been expired',
				400
			)
		)
	}

	if (req.body.password !== req.body.confirmPassword) {
		return next(new ErrorHandler('Password does not password', 400))
	}

	user.password = req.body.password
	user.resetPasswordToken = undefined
	user.resetPasswordExpire = undefined

	await user.save()

	sendToken(user, 200, res)
})
