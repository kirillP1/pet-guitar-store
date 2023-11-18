import catchAsyncErrors from '../middleware/catchAsyncErrors.js'
import Product from '../models/productModel.js'
import ErrorHandler from '../utils/ErrorHandler.js'

// Get All Products
export const getAllProducts = catchAsyncErrors((req, res) => {
	Product.find()
		.sort({ createdAt: -1 })
		.then(products => res.status(200).json(products))
		.catch(e => next(new ErrorHandler(`${e}`, 500)))
})

// Get One Product
export const getProduct = catchAsyncErrors(async (req, res, next) => {
	Product.findById(req.params.id)
		.then(product =>
			res.status(200).json({
				success: true,
				product,
			})
		)
		.catch(e => next(new ErrorHandler(`${e}`, 404)))
})

// ADMIN
// Create Product --ADMIN
export const createProduct = catchAsyncErrors(async (req, res) => {
	const product = await Product.create(req.body)
	res.status(201).json({
		success: true,
		product,
	})
})

// Update Product --ADMIN
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
	Product.findByIdAndUpdate(req.params.id, req.body)
		.then(product =>
			res.status(200).json({
				success: true,
				product,
			})
		)
		.catch(e => next(new ErrorHandler(`${e}`, 404)))
})

// Delete Product --ADMIN
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
	Product.findByIdAndDelete(req.params.id)
		.then(product =>
			res.status(200).json({
				success: true,
				message: 'Продукт успешно удален',
			})
		)
		.catch(e => next(new ErrorHandler(`${e}`, 404)))
})
