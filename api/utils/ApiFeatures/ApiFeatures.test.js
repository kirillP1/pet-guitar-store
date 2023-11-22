import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import Product from '../../models/productModel.js'
import ApiFeatures from './ApiFeatures.js'

let mongoServer

describe('ApiFeatures', () => {
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

	beforeEach(async () => {
		await Product.deleteMany({})
	})

	afterAll(async () => {
		await mongoose.disconnect()
		await mongoServer.stop()
	})
	describe('filter function', () => {
		it('should filter', async () => {
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
	describe('pagination function', () => {
		it('First page Pagination', async () => {
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
	describe('search function', () => {
		it('should not find by keyword', async () => {
			// Добавьте данные для тестирования
			await Product.create({
				name: 'TestItem',
				description: 'description',
				price: 10000,
			})
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
			// Добавьте данные для тестирования
			await Product.create({
				name: 'TestItem',
				description: 'description',
				price: 10000,
			})
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
			// Добавьте данные для тестирования
			await Product.create({
				name: 'TestItem',
				description: 'description',
				price: 10000,
			})
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
})
