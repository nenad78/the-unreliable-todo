const cors = (app) => {
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*')
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, sessionId')
		res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PATCH')
		next()
	})
}

module.exports = cors
