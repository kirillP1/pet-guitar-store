class ApiFeaturesHelper {
	static removeFields(queryStr) {
		const queryCopy = { ...queryStr }

		//   Removing some fields for category
		const removeFields = ['keyword', 'page', 'limit']
		removeFields.forEach(key => delete queryCopy[key])

		return queryCopy
	}
	static filterPriceRating(queryCopy) {
		// Filter For Price and Rating
		let queryStr = JSON.stringify(queryCopy)
		queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`)

		return JSON.parse(queryStr)
	}
}

export default ApiFeaturesHelper
