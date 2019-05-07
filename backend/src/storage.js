const {UnauthorizedError, SESSION_TIME} = require('./constants')


class Storage {
	constructor () {
		this.storage = {}

		this.createSession = this.createSession.bind(this)
		this.getSession = this.getSession.bind(this)
		this.updateSession = this.updateSession.bind(this)
		this.deleteSession = this.deleteSession.bind(this)
		this.__renewSession = this.__renewSession.bind(this)
	}


	createSession (session) {
		const date = new Date()

		this.storage[session.id] = {
			id: undefined,
			expiresAt: undefined,
			errorRate: undefined,
			created: date.toISOString(),
			updated: date.toISOString(),
			...session
		}
		this.__renewSession(session.id)
	}

	getSession (id) {
		this.__clearOldSessions()

		const found = this.storage[id]

		if (!found) {
			throw new UnauthorizedError()
		}

		this.__renewSession(id)

		return found
	}

	updateSession (id, partialSession) {
		const found = this.getSession(id)

		this.storage[id] = {...found, ...partialSession, updated: new Date().toISOString()}
	}

	deleteSession (id) {
		this.getSession(id)

		delete this.storage[id]
	}


	__renewSession (id) {
		const found = this.storage[id]

		if (!found) {
			return
		}

		this.storage[id] = {...found, expiresAt: new Date().getTime() + SESSION_TIME}
	}

	__clearOldSessions () {
		const currentTime = new Date().getTime()

		this.storage = Object.values(this.storage)
			.filter((session) => session.expiresAt > currentTime)
			.reduce((acc, session) => ({...acc, [session.id]: session}), {})
	}
}
const storage = new Storage()


module.exports = storage