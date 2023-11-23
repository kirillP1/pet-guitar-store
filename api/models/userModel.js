import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import validator from 'validator'

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please Enter Your Name'],
			maxLength: [30, 'Name cannot exceed 30 characters'],
			minLength: [4, 'Name should have more than 4 characters'],
		},
		email: {
			type: String,
			required: [true, 'Please Enter Your Email'],
			unique: true,
			validate: [validator.isEmail, 'Please Enter a valid Email'],
		},
		password: {
			type: String,
			required: [true, 'Please Enter Your Password'],
			minLength: [8, 'Password should be greater than 8 characters'],
			select: false,
		},
		avatar: {
			public_id: {
				type: String,
			},
			url: {
				type: String,
			},
		},
		role: {
			type: String,
			default: 'user',
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},

		resetPasswordToken: String,
		resetPasswordExpire: Date,
	},
	{ timestamps: true }
)

// Function before userSchema save
userSchema.pre('save', async function (next) {
	// If password was not modified
	if (!this.isModified('password')) {
		next()
	}
	// If password was modified
	// Hashing password
	this.password = await bcrypt.hash(this.password, 10)
})

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: '24h',
	})
}

// Compare password
userSchema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

export default User
