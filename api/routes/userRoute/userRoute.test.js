import request from 'supertest'
import { app } from '../../index.js'
import User from '../../models/userModel'
describe('Users', () => {
	afterAll(async () => {
		const testUser = await User.find({ name: 'TestUser' }).limit(1)
		console.log('afterAll testUser', testUser)
		if (testUser[0]) {
			await User.findByIdAndDelete(testUser[0]._id)
		}
	})
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
	describe('/api/user/password', () => {
		describe('/forgot', () => {
			it('should not forgot with incorrect email and return 404', async () => {
				const oldCount = await User.countDocuments()
				await User.create({
					name: 'TestUser',
					email: 'emailTest12@mail.ru',
					password: '123456789',
				})

				await request(app)
					.post('/api/user/password/forgot')
					.send({
						email: 'notRight@mail.ru',
					})
					.expect(404)

				const testUser = await User.find({ name: 'TestUser' }).limit(1)

				await User.findByIdAndDelete(testUser[0]._id)
				const newCount = await User.countDocuments()

				expect(newCount).toBe(oldCount)
			})
			it('should send email, create resetPasswordToken  and return 200', async () => {
				const oldCount = await User.countDocuments()
				const user = await User.create({
					name: 'TestUser',
					email: 'emailTest12@mail.ru',
					password: '123456789',
				})

				await request(app)
					.post('/api/user/password/forgot')
					.send({
						email: 'emailTest12@mail.ru',
					})
					.expect(200)

				const testUser = await User.find({ name: 'TestUser' }).limit(1)

				await User.findByIdAndDelete(testUser[0]._id)
				const newCount = await User.countDocuments()

				expect(newCount).toBe(oldCount)
			})
		})
		describe('/reset', () => {
			it('should not reset password because not found user and 400', async () => {})

			it('should not reset password because password does not confirmed password and 400', async () => {})

			it('should reset password and return 200', async () => {})
		})
	})
})
