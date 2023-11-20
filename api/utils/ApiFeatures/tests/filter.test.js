import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import Product from '../../../models/productModel'
import ApiFeatures from '../ApiFeatures'

let mongoServer
describe('search function', () => {
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
			name: 'RightItem',
			description: 'description',
			price: 12000,
		})
		await Product.create({
			name: 'NotRightItem',
			description: 'description',
			price: 20000,
		})
	})

	afterAll(async () => {
		await mongoose.disconnect()
		await mongoServer.stop()
	})

	it('should filter', async () => {
		// Создайте объект, имитирующий запрос
		const fakeQuery = {
			price: { gt: '10600', lt: '19000' },
		}

		const apiFeatures = new ApiFeatures(Product.find(), fakeQuery)
			.search()
			.filter()

		const products = await apiFeatures.query

		// Проверьте, что результат содержит ожидаемый элемент
		expect(products).toHaveLength(1)
		expect(products[0].name).toBe('RightItem')
	})

	it('should filter empty', async () => {
		// Создайте объект, имитирующий запрос
		const fakeQuery = {
			price: { gt: '13600', lt: '19000' },
		}

		const apiFeatures = new ApiFeatures(Product.find(), fakeQuery)
			.search()
			.filter()

		const products = await apiFeatures.query

		// Проверьте, что результат содержит ожидаемый элемент
		expect(products).toHaveLength(0)
	})
})
