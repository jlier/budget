module.exports = (app) => {
	require('../auth/passport')(app);
	const passport = require('passport');

	const main_controllers = require('../controllers/main_controllers');
	const budget_controllers = require('../controllers/budget_controllers');
	const shopping_controllers = require('../controllers/shopping_controllers');

	// Main
	app.get('/', main_controllers.index);
	app.get('/login', main_controllers.login);
	app.get('/logout', main_controllers.logout);
	app.get('/signup', main_controllers.signupform);

	app.post('/signup', main_controllers.signup);
	app.post('/login', passport.authenticate('local'), (req, res) => {
		res.redirect('/budget');
	});
	
	// Budget
	app.get('/budget', budget_controllers.budget);
	app.post('/update', budget_controllers.update);

	// Shopping list
	app.get('/Shoppinglist/', shopping_controllers.shoppinglist);
	app.get('/Shoppinglist/:list_id', shopping_controllers.list);
	
}
