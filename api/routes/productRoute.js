import express, { Router } from 'express'
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProduct,
	updateProduct,
} from '../controllers/productController.js'

const productRouter = new Router()

// Use express.json() middleware to parse JSON request bodies
productRouter.use(express.json())

// Get All Products
productRouter.route('/').get(getAllProducts)

// Create New Product
productRouter.route('/new').post(createProduct)

// Get, Update, Delete One product by ID
productRouter
	.route('/:id')
	.get(getProduct)
	.put(updateProduct)
	.delete(deleteProduct)

export default productRouter
