const user_routes 	= require('express').Router();
const passport 		= require('../auth/passport');

const user_controller = require('./user');

user_routes.get('/', user_controller.index);
user_routes.get('/login', user_controller.login);
user_routes.get('/logout', user_controller.logout);
user_routes.get('/signup', user_controller.signupform);
user_routes.post('/signup', user_controller.signup);

user_routes.post('/login', passport.authenticate('local'), (req, res) => {
	if (req.session.redirectTo) {
		var redir = req.session.redirectTo;
		delete req.session.redirectTo;
	}
	else { 
		var redir = '/'
	}
	res.redirect(redir);
});

module.exports = user_routes;