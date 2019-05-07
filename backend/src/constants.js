const DEFAULT_ERROR_RATE = 50
const STATUS = {
	OK: 'OK',
	ERROR: 'ERROR',
}
const MINUTE_MS = 1000 * 60
const DAY_MS = MINUTE_MS * 60 * 24
const SESSION_TIME = 20 * MINUTE_MS
const RATE_LIMIT = 500 // Per minute

const PORT = 9000

class UnauthorizedError extends Error {}
class UnreliableError extends Error {}


const TODO_TEXTS = [
	'Feed the fish',
	'Feed the dog',
	'Feed the baby',
	'Eat something',
	'Exercise',
	'Take medicine',
	'Go to sleep',
	'Call mom',
	'Call dad',
	'Watch TV',
	'Go fishing',
]

module.exports = {
	DEFAULT_ERROR_RATE, SESSION_TIME, RATE_LIMIT, PORT, STATUS, TODO_TEXTS, UnreliableError, UnauthorizedError,
	MINUTE_MS, DAY_MS,
}