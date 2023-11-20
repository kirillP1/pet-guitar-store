import catchAsyncErrors from '../middleware/catchAsyncErrors.js'
import User from '../models/userModel.js'

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

	res.status(201).json({
		success: true,
		user,
	})
})
