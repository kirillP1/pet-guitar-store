import { Router } from 'express'
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProduct,
	updateProduct,
} from '../../controllers/productController.js'
import { authorizeRoles, isAuthenticatedUser } from '../../middleware/auth.js'

const productRouter = new Router()

// Get All Products
productRouter.route('/').get(getAllProducts)

// Create New Product
productRouter
	.route('/new')
	.post(isAuthenticatedUser, authorizeRoles('admin'), createProduct)

// Get, Update, Delete One product by ID
productRouter
	.route('/:id')
	.get(getProduct)
	.put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
	.delete(deleteProduct)

export default productRouter
