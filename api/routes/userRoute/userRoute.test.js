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
})
