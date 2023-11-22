import request from 'supertest'
import { CONST_RESULT_PER_PAGE } from '../../controllers/productController.js'
import { app } from '../../index.js'
import Product from '../../models/productModel.js'

describe('Products', () => {
	describe('/api/product', () => {
		it('should return 200 and all products', async () => {
			const req = await request(app).get('/api/product')
			const count = await Product.countDocuments()

			await request(app).get('/api/product').expect(200)

			expect(req.body.products.length).toBeLessThanOrEqual(
				CONST_RESULT_PER_PAGE
			)
			expect(req.body.productCount).toBe(count)
		})
	})

	describe('/api/product/new', () => {
		it('should not create product with incorrect data', async () => {
			const oldCount = await Product.countDocuments()

			await request(app)
				.post('/api/product/new')
				.send({ title: '' })
				.expect(400)
			const newCount = await Product.countDocuments()

			expect(newCount).toBe(oldCount)
		})

		it('should create product', async () => {
			const fakeProduct = {
				name: 'TestProduct',
				description: 'fuck yearrrrrr',
				price: 11600,
				ratings: 0,
				category: 'Strat',
			}

			await request(app).post('/api/product/new').send(fakeProduct).expect(201)

			let products = await Product.find({ name: 'TestProduct' })
			await Product.findByIdAndDelete(products.pop()._id)
		})
	})

	describe('/api/product/:id', () => {
		describe('get', () => {
			it('should return 404 for not existing product', async () => {
				await request(app).get('/api/product/999').expect(404)
			})
			it('should find product by id', async () => {
				const oldCount = await Product.countDocuments()

				await Product.create({
					name: 'TestItem',
					description: 'description',
					price: 10000,
				})
				const product = await Product.find({ name: 'TestItem' }).limit(1)
				const uriProduct = await request(app).get(
					`/api/product/${product[0]._id.toString()}`
				)

				expect(uriProduct.body.product._id).toBe(product[0]._id.toString())

				await Product.findByIdAndDelete(product[0]._id)
				const newCount = await Product.countDocuments()

				expect(newCount).toBe(oldCount)
			})
		})
		describe('update', () => {
			it('should update product by id', async () => {
				const oldCount = await Product.countDocuments()

				await Product.create({
					name: 'TestItem',
					description: 'description',
					price: 10000,
				})
				const product = await Product.find({ name: 'TestItem' }).limit(1)
				let uriProduct = await request(app)
					.put(`/api/product/${product[0]._id.toString()}`)
					.send({
						name: 'TestItem',
						description: 'description',
						price: 15000,
					})
				uriProduct = await Product.find({ name: 'TestItem' }).limit(1)

				expect(uriProduct[0].price).toBe(15000)

				await Product.findByIdAndDelete(product[0]._id)
				const newCount = await Product.countDocuments()

				expect(newCount).toBe(oldCount)
			})

			it('should not update product by incorrect id', async () => {
				await request(app)
					.put(`/api/product/999`)
					.send({
						name: 'TestItem',
						description: 'description',
						price: 15000,
					})
					.expect(404)
			})
		})
		describe('delete', () => {
			it('should delete product by id', async () => {
				const oldCount = await Product.countDocuments()

				await Product.create({
					name: 'TestItem',
					description: 'description',
					price: 10000,
				})

				const product = await Product.find({ name: 'TestItem' }).limit(1)
				await request(app).delete(`/api/product/${product[0]._id.toString()}`)

				const newCount = await Product.countDocuments()
				expect(newCount).toBe(oldCount)
			})
		})
	})
})
