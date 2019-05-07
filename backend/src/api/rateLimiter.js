const {RATE_LIMIT, MINUTE_MS} = require('../constants')
const {generateError} = require('../utils')

let timestamps = []

const rateLimiter = (app) => {
	app.use((req, res, next) => {
		const currentTime = new Date().getTime()

		timestamps.push(currentTime)

		timestamps = timestamps.filter((timestamp) => timestamp > currentTime - MINUTE_MS)

		if (timestamps.length > RATE_LIMIT) {
			return res.status(429).json(generateError('serving too many requests', false, true))
		}

		return next()
	})
}

module.exports = rateLimiter