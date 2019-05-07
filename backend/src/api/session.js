// const bodyParser = require('body-parser')
const uuid = require('uuid/v4')
const { DEFAULT_ERROR_RATE, STATUS } = require('../constants')
const { generateError, raiseErrorBySessionId, dealWithError, generateTodo } = require('../utils')
const storage = require('../storage')


const apiPath = '/api/session'

const session = (app) => {
  app.post(apiPath, (req, res) => {
		const activity = 'creating a session'

		const sessionId = uuid()

    const { errorRate = DEFAULT_ERROR_RATE } =  req.body

		if (typeof errorRate !== 'number' || errorRate < 0 || errorRate > 100 || Number.isNaN(errorRate)) {
			return res.status(400).json(generateError(activity, true))
		}

		storage.createSession({
			id: sessionId,
			errorRate,
			todos: Array(Math.floor(Math.random() * 7))
				.fill(null)
				.map(generateTodo)
				.reduce((acc, todo) => ({ ...acc, [todo.id]: todo }), {}),
		})

		console.log(`Created session ${ sessionId }`)
		return res.status(201).json({
			status: STATUS.OK,
			sessionId,
			errorRate,
		})
	})

	app.patch(apiPath, (req, res) => {
		const activity = 'altering a session'

		const sessionId = req.headers.sessionid
		const {errorRate} = req.body

		if (typeof errorRate !== 'number' || errorRate < 0 || errorRate > 100 || Number.isNaN(errorRate)) {
			return res.status(400).json(generateError(activity, true))
		}

		try {
			raiseErrorBySessionId(sessionId)

			storage.updateSession(sessionId, {errorRate})

			console.log(`Altered session ${sessionId}`)
			res.status(200).json({
				status: STATUS.OK,
				errorRate,
			})
		} catch (e) {
			dealWithError(activity, e, res)
		}
	})

	app.delete(`${apiPath}`, (req, res) => {
		const activity = 'deleting a session'

		try {
			const sessionId = req.headers.sessionid

			raiseErrorBySessionId(sessionId)

			storage.deleteSession(sessionId)

			console.log(`Deleted session ${sessionId}`)
			res.status(200).json({
				status: STATUS.OK,
			})
		} catch (e) {
			dealWithError(activity, e, res)
		}
	})

}

module.exports = session
