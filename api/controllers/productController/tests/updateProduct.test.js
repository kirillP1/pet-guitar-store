import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import Product from '../../../models/productModel.js'

let mongoServer
describe('updateProduct function', () => {
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
	})

	afterAll(async () => {
		await mongoose.disconnect()
		await mongoServer.stop()
	})

	it('Update product', async () => {
		const product = await Product.create({
			name: 'FirstItem',
			description: 'description',
			price: 10000,
		})

		const newQuery = {
			name: 'NewFirstItem',
			description: 'description',
			price: 10000,
		}

		let updateProduct = await Product.findByIdAndUpdate(product._id, newQuery)
		updateProduct = await Product.findById(product._id)

		expect(updateProduct.name).toBe('NewFirstItem')
	})
})
