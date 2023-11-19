import catchAsyncErrors from '../middleware/catchAsyncErrors.js'
import Product from '../models/productModel.js'
import ErrorHandler from '../utils/ErrorHandler.js'
import ApiFeatures from '../utils/apiFeatures.js'

// Get All Products
export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
	try {
		const resultPerPage = 5

		// Count of all products in the MongoDB
		const productCount = await Product.countDocuments()

		// Get filtered products
		const apiFeatures = new ApiFeatures(Product.find(), req.query)
			.search()
			.filter()

		// Copy results of query
		const apiFeaturesProducts = await apiFeatures.query.clone()

		// Get count of filtered products
		const filteredProductsCount = apiFeaturesProducts.length

		// Do pagination
		apiFeatures.pagination(resultPerPage)

		// Get paginated products
		const paginatedProducts = await apiFeatures.query

		res.status(200).json({
			success: true,
			products: paginatedProducts,
			resultPerPage,
			productCount,
			filteredProductsCount,
		})
	} catch (e) {
		next(new ErrorHandler(`${e}`, 404))
	}
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
