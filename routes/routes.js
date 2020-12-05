module.exports = (app) => {
	require('../auth/passport')(app);
	const passport = require('passport');

	const controllers = require('../controllers/controllers');

	app.get('/', controllers.index);
	app.get('/login', controllers.login);
	app.get('/logout', controllers.logout);
	app.get('/budget', controllers.budget);

	app.post('/login', passport.authenticate('local'), (req, res) => {
		res.redirect('/budget');
	})
}