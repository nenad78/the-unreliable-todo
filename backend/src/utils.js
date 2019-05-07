const uuid = require('uuid/v4')
const {STATUS, UnauthorizedError, UnreliableError, TODO_TEXTS, DAY_MS} = require('./constants')
const storage = require('./storage')


const raiseErrorBySessionId = (sessionId) => {
	raiseError(storage.getSession(sessionId).errorRate)
}

const raiseError = (errorRate) => {
	if (Math.random() * 100 < errorRate) {
		throw new UnreliableError()
	}
}

const generateError = (activity, isMalformed, isReal = false, isUnauthorized = false) => {
	const cta = isMalformed ? 'Please check Apiary for documentation.' : 'Please try again.'
	const activityText = activity ? ` while ${activity}` : ''
	const error = (isUnauthorized ? 'Authorization error: ' : '') + (
		isReal
			? `A real error has occurred${activityText}.`
			: `An error has occurred${activityText}. ${cta}`
	)

	return {
		status: STATUS.ERROR,
		error,
	}
}

const dealWithError = (activity, error, res) => {
	if (error instanceof UnreliableError) {
		return res.status(500).json(generateError(activity, false))
	}

	if (error instanceof UnauthorizedError) {
		return res.status(401).json(generateError(activity, true, true, true))
	}

	return res.status(500).json(generateError(activity, false, true))
}

const getRandomFromArray = (arr) => arr[Math.floor(Math.random() * arr.length)]

const generateTodo = () => {
	const currentTime = new Date().getTime()
	const updated = currentTime - Math.round(Math.random() * DAY_MS)
	const created = Math.random() > 0.5 ? updated : updated - Math.round(Math.random() * DAY_MS)
	const urgency = 1 + Math.floor(Math.random() * 5) // Between 1 and 5

	return {
		id: uuid(),
		text: getRandomFromArray(TODO_TEXTS),
		created: new Date(created).toISOString(),
		updated: new Date(updated).toISOString(),
		isCompleted: Math.random() > 0.5,
		urgency,
	}
}

module.exports = {raiseError, raiseErrorBySessionId, generateError, dealWithError, generateTodo, getRandomFromArray}