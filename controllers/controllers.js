const { Pool } = require('pg');

const pool = new Pool({
	connectionString: process.env.connection_string,
	ssl: {
		rejectUnauthorized: false
	}
})

exports.index = (req, res) => {
	console.log(req.session);
	res.render('pages/index');
}

exports.login = (req, res) => {
	console.log(req.session);
	if (req.user) {
		res.redirect('/budget');
	}
	else {
		res.render('pages/login');
	}
}

exports.logout = (req, res) => {
	console.log(req.session);
	req.logout();
	res.redirect('/login');
}

exports.budget = (req, res) => {
	console.log(req.session);
	if(!req.isAuthenticated()) {
		res.redirect('/login');
	}
	else{
		pool.connect((error, client, release) => {
			client.query('select * from budget_parameter', (err, result) => {
				release();

				if (err) console.error(err);
				else {
					parameters = {
						monthly: result.rows[0].budget,
						left: result.rows[0].left,
						user: req.user
					}
					res.render('pages/budget', parameters);
					return;
				}
			})
		});
	}
}