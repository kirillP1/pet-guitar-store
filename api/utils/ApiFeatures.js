import ApiFeaturesHelper from '../helpers/ApiFeaturesHelpers.js'

class ApiFeatures {
	constructor(query, queryStr) {
		this.query = query
		this.queryStr = queryStr
	}
	// Search query to MongoDB
	search() {
		// ?keyword='text'
		const keyword = this.queryStr.keyword
			? {
					// $option: 'i' means 'ignore case'
					name: {
						$regex: this.queryStr.keyword,
						$options: 'i',
					},
			  }
			: {}

		this.query = this.query.find({ ...keyword })
		return this
	}

	// Filter query to MongoDB
	filter() {
		//   Removing some fields for category
		let queryCopy = ApiFeaturesHelper.removeFields(this.queryStr)

		// Filter For Price and Rating
		queryCopy = ApiFeaturesHelper.filterPriceRating(queryCopy)

		this.query = this.query.find(queryCopy)
		return this
	}

	pagination(resultPerPage) {
		// Initializing constants
		const currentPage = Number(this.queryStr.page) || 1
		const skip = resultPerPage * (currentPage - 1)

		// Get required paginated data
		this.query = this.query.limit(resultPerPage).skip(skip)
		return this
	}
}

export default ApiFeatures
