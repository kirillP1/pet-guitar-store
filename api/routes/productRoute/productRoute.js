import { Router } from 'express'
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProduct,
	updateProduct,
} from '../../controllers/productController.js'
import { isAuthenticatedUser } from '../../middleware/auth.js'

const productRouter = new Router()

// Get All Products
productRouter.route('/').get(isAuthenticatedUser, getAllProducts)

// Create New Product
productRouter.route('/new').post(createProduct)

// Get, Update, Delete One product by ID
productRouter
	.route('/:id')
	.get(getProduct)
	.put(updateProduct)
	.delete(deleteProduct)

export default productRouter
