const storage = require('../storage')
// const bodyParser = require('body-parser')
const { raiseErrorBySessionId, dealWithError, generateError } = require('../utils')
const { STATUS } = require('../constants')
const uuid = require('uuid')

const apiPath = '/api/todos'

const todos = (app) => {
	app.post(apiPath, (req, res) => {
    const activity = 'creating a todo'

		try {
			const sessionId = req.headers.sessionid

			const { text, urgency, isCompleted } = req.body

			if (
        typeof text !== 'string' ||
				typeof isCompleted !== 'boolean' ||
				typeof urgency !== 'number' ||
				urgency < 1 || urgency > 5 || Number.isNaN(urgency)
			) {
				return res.status(400).json(generateError(activity, true))
			}

			raiseErrorBySessionId(sessionId)

			const { todos } = storage.getSession(sessionId)

			const newTodoId = uuid()
			const currentTime = new Date().toISOString()
			const newTodo = {
				id: newTodoId,
				created: currentTime,
				updated: currentTime,
        text,
				isCompleted,
				urgency,
			}

			const updatedTodos = {
				...todos,
				[newTodoId]: newTodo,
			}

			storage.updateSession(sessionId, { todos: updatedTodos })

			console.log(`Created todo ${ newTodoId } for ${ sessionId }`)
			res.status(201).json({
				status: STATUS.OK,
				todo: newTodo,
			})
		} catch (e) {
			dealWithError(activity, e, res)
		}
	})

	app.get(apiPath, (req, res) => {
		const activity = 'getting todos'

		try {
			const sessionId = req.headers.sessionid

			raiseErrorBySessionId(sessionId)

			const { todos } = storage.getSession(sessionId)

			console.log(`Returned todos for ${ sessionId }`)
			res.status(200).json({
				status: STATUS.OK,
				todos,
			})
		} catch (e) {
			dealWithError(activity, e, res)
		}
	})

	app.patch(`${apiPath}/:todoId`, (req, res) => {
		const activity = 'altering a todo'

		try {
			const sessionId = req.headers.sessionid
			const todoId = req.params.todoId

			const {todos} = storage.getSession(sessionId)
			const todo = todos[todoId]

			const text = String(req.body.text == null ? todo.text : req.body.text)
			const isCompleted = Boolean(req.body.isCompleted == null ? todo.isCompleted : req.body.isCompleted)
			const urgency = Number(req.body.urgency == null ? todo.urgency : req.body.urgency)

			if (!todo) {
				return res.status(404).json(generateError(activity, true))
			}
			if (urgency < 1 || urgency > 5 || Number.isNaN(urgency)) {
				return res.status(400).json(generateError(activity, true))
			}

			raiseErrorBySessionId(sessionId)

			const updatedTodo = {
				...todo,
				text,
				isCompleted,
				urgency,
				updated: new Date().toISOString(),
			}

			storage.updateSession(sessionId, {
				todos: {
					...todos,
					[todoId]: updatedTodo,
				}
			})

			console.log(`Altered todo ${todoId} for ${sessionId}`)
			res.status(200).json({
				status: STATUS.OK,
				todo: updatedTodo,
			})
		} catch (e) {
			dealWithError(activity, e, res)
		}
	})

	app.delete(`${apiPath}/:todoId`, (req, res) => {
		const activity = 'deleting a todo'

		try {
			const sessionId = req.headers.sessionid
			const todoId = req.params.todoId

			const {todos} = storage.getSession(sessionId)
			const todo = todos[todoId]

			if (!todo) {
				return res.status(404).json(generateError(activity, true))
			}

			raiseErrorBySessionId(sessionId)

			const updatedTodos = Object.values(todos)
				.filter((todo) => todo.id !== todoId)
				.reduce((acc, todo) => ({...acc, [todo.id]: todo}), {})

			storage.updateSession(sessionId, {
				todos: updatedTodos,
			})

			console.log(`Deleted todo ${todoId} for ${sessionId}`)
			res.status(200).json({
				status: STATUS.OK,
				todos: updatedTodos,
			})
		} catch (e) {
			dealWithError(activity, e, res)
		}
	})
}

module.exports = todos
