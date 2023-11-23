import request from 'supertest'
import { app } from '../../index.js'
import User from '../../models/userModel'
describe('Users', () => {
	describe('/api/user/register', () => {
		it('should register user and return 201', async () => {
			const oldCount = await User.countDocuments()
			await request(app)
				.post('/api/user/register')
				.send({
					name: 'TestUser',
					email: 'emailTest12@mail.ru',
					password: '123456789',
				})
				.expect(201)

			const testUser = await User.find({ name: 'TestUser' }).limit(1)

			expect(testUser).toBeDefined()
			expect(testUser).not.toBeNull()

			await User.findByIdAndDelete(testUser[0]._id)
			const newCount = await User.countDocuments()

			expect(newCount).toBe(oldCount)
		})

		it('should not register user and return 400', async () => {
			const oldCount = await User.countDocuments()
			await request(app)
				.post('/api/user/register')
				.send({
					name: 'TestUser',
					email: 'emailTest12@mail.ru',
					password: '12349',
				})
				.expect(400)

			const newCount = await User.countDocuments()

			expect(newCount).toBe(oldCount)
		})
	})
	describe('/api/user/login', () => {
		it('should login and return 201', async () => {
			const oldCount = await User.countDocuments()
			await User.create({
				name: 'TestUser',
				email: 'emailTest12@mail.ru',
				password: '123456789',
			})

			const loginUser = await request(app)
				.post('/api/user/login')
				.send({
					email: 'emailTest12@mail.ru',
					password: '123456789',
				})
				.expect(201)

			expect(loginUser.body.token).toBeDefined()
			expect(loginUser.body.token).not.toBeNull()

			const testUser = await User.find({ name: 'TestUser' }).limit(1)

			expect(loginUser.body.user._id).toBe(testUser[0]._id.toString())

			await User.findByIdAndDelete(testUser[0]._id)
			const newCount = await User.countDocuments()

			expect(newCount).toBe(oldCount)
		})

		it('should not login because do not entered Email & Password and return 400', async () => {
			const oldCount = await User.countDocuments()
			await User.create({
				name: 'TestUser',
				email: 'emailTest12@mail.ru',
				password: '123456789',
			})

			await request(app).post('/api/user/login').send({}).expect(400)

			const testUser = await User.find({ name: 'TestUser' }).limit(1)

			await User.findByIdAndDelete(testUser[0]._id)
			const newCount = await User.countDocuments()

			expect(newCount).toBe(oldCount)
		})

		it('should not login because invalid Email or Password and return 401', async () => {
			const oldCount = await User.countDocuments()
			await User.create({
				name: 'TestUser',
				email: 'emailTest12@mail.ru',
				password: '123456789',
			})

			await request(app)
				.post('/api/user/login')
				.send({
					email: 'emailTest12@mail.ru',
					password: '12349',
				})
				.expect(401)

			const testUser = await User.find({ name: 'TestUser' }).limit(1)

			await User.findByIdAndDelete(testUser[0]._id)
			const newCount = await User.countDocuments()

			expect(newCount).toBe(oldCount)
		})
	})
	describe('/api/user/logout', () => {
		it('should logout and return 200', async () => {
			const oldCount = await User.countDocuments()
			await User.create({
				name: 'TestUser',
				email: 'emailTest12@mail.ru',
				password: '123456789',
			})

			await request(app)
				.get('/api/user/logout')
				.expect(200)
				.expect('Set-Cookie', /token=/, { negate: true })

			const testUser = await User.find({ name: 'TestUser' }).limit(1)

			await User.findByIdAndDelete(testUser[0]._id)
			const newCount = await User.countDocuments()

			expect(newCount).toBe(oldCount)
		})
	})
})
