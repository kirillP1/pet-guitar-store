import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import Product from '../../../models/productModel.js'

let mongoServer
describe('deleteProduct function', () => {
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

	it('Delete product', async () => {
		let product = await Product.create({
			name: 'FirstItem',
			description: 'description',
			price: 10000,
		})
		product = await Product.findByIdAndDelete(product._id)
		const products = await Product.findById(product._id)
		expect(products).toBeNull()
	})
})
