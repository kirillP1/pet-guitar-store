import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import Product from '../../../models/productModel.js'
import ApiFeatures from '../ApiFeatures.js'

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
			name: 'TestItem',
			description: 'description',
			price: 10000,
		})
	})

	afterAll(async () => {
		await mongoose.disconnect()
		await mongoServer.stop()
	})

	it('should not find by keyword', async () => {
		// Создайте объект, имитирующий запрос
		const fakeQuery = {
			keyword: 'not',
		}

		// Вызовите метод search с фейковым запросом
		const apiFeatures = new ApiFeatures(Product.find(), fakeQuery).search()
		const products = await apiFeatures.query

		// Проверьте, что результат содержит ожидаемый элемент
		expect(products).toHaveLength(0)
	})

	it('should search by keyword', async () => {
		// Создайте объект, имитирующий запрос
		const fakeQuery = {
			keyword: 'test',
		}

		// Вызовите метод search с фейковым запросом
		const apiFeatures = new ApiFeatures(Product.find(), fakeQuery).search()
		const products = await apiFeatures.query

		// Проверьте, что результат содержит ожидаемый элемент
		expect(products).toHaveLength(1)
		expect(products[0].name).toBe('TestItem')
	})

	it('should handle empty keyword', async () => {
		// Создайте объект, имитирующий запрос без ключевого слова
		const fakeQuery = {
			keyword: '',
		}

		// Вызовите метод search с фейковым запросом
		const apiFeatures = new ApiFeatures(Product.find(), fakeQuery).search()
		const products = await apiFeatures.query

		// Проверьте, что результат содержит ожидаемый элемент
		expect(products.map(item => item.name)).toContain('TestItem')
	})
})
