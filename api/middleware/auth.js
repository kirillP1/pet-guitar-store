import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import ErrorHandler from '../utils/errorHandler.js'
import catchAsyncErrors from './catchAsyncErrors.js'

export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
	const { token } = req.cookies
	console.log('middleware token', req.cookies)
	if (!token) {
		return next(new ErrorHandler('Please Login to access this resource', 401))
	}

	const decodedData = jwt.verify(token, process.env.JWT_SECRET)

	req.user = await User.findById(decodedData.id)

	next()
})

export const authorizeRoles = (...roles) => {
	return (res, req, next) => {
		if (!roles.includes(res.user.role)) {
			return next(
				new ErrorHandler(
					`Role: ${res.user.role} is not allowed to access this resource `,
					403
				)
			)
		}
		next()
	}
}
