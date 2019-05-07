// https://xclacksoverhead.org/home/about

const pratchett = (app) => {
	app.use((req, res, next) => {
		res.set('X-Clacks-Overhead', 'GNU Terry Pratchet')
		next()
	})
}

module.exports = pratchett
