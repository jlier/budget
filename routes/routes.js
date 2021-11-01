module.exports = (app) => {
	require('../auth/passport')(app);
	const passport = require('passport');

	const main = require('../controllers/main');
	const budget = require('../controllers/budget');
	const shopping = require('../controllers/shopping');

	// Main
	app.get('/', main.index);
	app.get('/login', main.login);
	app.get('/logout', main.logout);
	app.get('/signup', main.signupform);

	app.post('/signup', main.signup);
	app.post('/login', passport.authenticate('local'), (req, res) => {
		if (req.session.redirectTo) {
			var redir = req.session.redirectTo;
			delete req.session.redirectTo;
		}
		else { 
			var redir = '/'
		}
		res.redirect(redir);
	});
	
	// Budget
	app.get('/budget', main.checkLogin, budget.budget);
	app.post('/update', main.checkLogin, budget.update);

	// Shopping list
	app.get('/Shoppinglist/', main.checkLogin, shopping.list);
	app.get('/Shoppinglist/:list_id', main.checkLogin, shopping.detail);
	
}
