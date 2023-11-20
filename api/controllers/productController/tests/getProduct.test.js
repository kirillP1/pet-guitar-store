import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import Product from '../../../models/productModel.js'
import ApiFeatures from '../../../utils/ApiFeatures/ApiFeatures.js'

let mongoServer
describe('getProduct function', () => {
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
		// Добавьте данные для тестирования
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
		await Product.create({
			name: 'ThirdItem',
			description: 'description',
			price: 10000,
		})
	})

	afterAll(async () => {
		await mongoose.disconnect()
		await mongoServer.stop()
	})

	it('Find one product by id', async () => {
		const apiFeatures = new ApiFeatures(Product.find(), {}).search()

		const products = await apiFeatures.query

		const product_id = products[1]._id

		const product = await Product.findById(product_id)

		expect(product.name).toBe('SecondItem')
	})
})
