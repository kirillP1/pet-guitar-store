import mongoose from 'mongoose'

const productSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please Enter product Name'],
		trim: true,
	},
	description: {
		type: String,
		required: [true, 'Please Enter product Description'],
	},
	price: {
		type: Number,
		required: [true, 'Please Enter product Price'],
		maxLength: [8, 'Price cannot exceed 8 characters'],
	},
	ratings: {
		type: Number,
		default: 0,
	},
	images: [
		{
			public_id: {
				type: String,
			},
			url: {
				type: String,
			},
		},
	],
	category: {
		type: String,
	},
	Stock: {
		type: Number,
		maxLength: [4, 'Stock cannot exceed 4 characters'],
		default: 1,
	},
	numOfReviews: {
		type: Number,
		default: 0,
	},
	reviews: [
		{
			name: {
				type: String,
			},
			rating: {
				type: Number,
			},
			comment: {
				type: String,
			},
		},
	],
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})
// Добавьте метод search к схеме
productSchema.statics.search = function (keyword) {
	return this.find({
		name: { $regex: keyword, $options: 'i' },
	})
}

const Product = mongoose.model('Product', productSchema)

export default Product
