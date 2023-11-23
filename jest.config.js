// jest.config.js
export default {
	// ... другие опции конфигурации Jest
	testTimeout: 10000,
	testEnvironment: 'node',
	transform: {
		'^.+\\.jsx?$': 'babel-jest',
	},
	// ... другие опции конфигурации Jest
}
