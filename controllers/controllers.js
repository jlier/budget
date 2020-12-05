const { Pool } = require('pg');

const pool = new Pool({
	connectionString: process.env.connection_string,
	ssl: {
		rejectUnauthorized: false
	}
})

exports.index = (req, res) => {
	res.send('Nothing here.. Go to /login or /budget');
}

exports.login = (req, res) => {
	if (req.user) {
		console.log('Logged in:\n\tLogin -> Index\n==========\n')
		res.redirect('/budget');
	}
	else {
		res.render('pages/login');
	}
}

exports.logout = (req, res) => {
	req.logout();
	res.redirect('/login');
}

exports.budget = (req, res) => {
	if(!req.isAuthenticated()) {
		console.log('Not logged in.');
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