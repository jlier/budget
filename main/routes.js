const routes 	= require('express').Router()
const passport 	= require('../auth/passport')

const controller = require('./controller')

routes.get('/', 		controller.index)
routes.get('/login', 	controller.login)
routes.get('/logout', 	controller.logout)
routes.get('/signup', 	controller.signupform)
routes.post('/signup', 	controller.signup)

// passport
routes.post('/login', passport.authenticate('local'), (req, res) => {
	if (req.session.redirectTo) {
		var redir = req.session.redirectTo
		delete req.session.redirectTo
	}
	else { 
		var redir = '/'
	}
	res.redirect(redir)
})

module.exports = routes