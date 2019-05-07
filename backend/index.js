const express = require('express')
const session = require('./src/api/session')
const rateLimiter = require('./src/api/rateLimiter')
const todos = require('./src/api/todos')
const cors = require('./src/api/cors')
const pratchett = require('./src/api/pratchett')
const {PORT} = require('./src/constants')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.listen(PORT)

console.log(`Listening on port ${PORT}`)

cors(app)
pratchett(app)
rateLimiter(app)

session(app)
todos(app)

app.get('/api/test', (req, res) => res.status(200).send('It Works!'))
