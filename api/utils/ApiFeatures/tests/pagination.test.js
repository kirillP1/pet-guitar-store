import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import Product from '../../../models/productModel'
import ApiFeatures from '../ApiFeatures'

let mongoServer
describe('pagination function', () => {
	beforeAll(async () => {
		mongoServer = new MongoMemoryServer({
			binary: {
				version: '4.0.13', // Указываем версию MongoDB
			},
		})

		const mongoUri = await mongoServer.getUri()
		await mongoose.connect(mongoUri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		// Create Products
		await Product.create({
			name: 'FirstItem',
			description: 'description',
			price: 10000,
		})
		await Product.create({
			name: 'SecondItem',
			description: 'description',
			price: 10000,
		})
	})

	afterAll(async () => {
		await mongoose.disconnect()
		await mongoServer.stop()
	})

	it('First page Pagination', async () => {
		// Count of products on one page
		const resultPerPage = 1

		const fakeQuery = {}

		const apiFeatures = new ApiFeatures(Product.find(), fakeQuery)
			.search()
			.pagination(resultPerPage)

		// Get paginated products
		const products = await apiFeatures.query

		expect(products).toHaveLength(1)
		expect(products[0].name).toBe('FirstItem')
	})

	it('Second page Pagination', async () => {
		// Count of products on one page
		const resultPerPage = 1

		const fakeQuery = {
			page: '2',
		}

		const apiFeatures = new ApiFeatures(Product.find(), fakeQuery)
			.search()
			.pagination(resultPerPage)

		// Get paginated products
		const products = await apiFeatures.query

		expect(products).toHaveLength(1)
		expect(products[0].name).toBe('SecondItem')
	})

	it('Third page Pagination', async () => {
		// Count of products on one page
		const resultPerPage = 1

		const fakeQuery = {
			page: '3',
		}

		const apiFeatures = new ApiFeatures(Product.find(), fakeQuery)
			.search()
			.pagination(resultPerPage)

		// Get paginated products
		const products = await apiFeatures.query

		expect(products).toHaveLength(0)
	})
})
