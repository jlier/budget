const { Pool } = require('pg');

const pool = new Pool({
	connectionString: process.env.connection_string,
	ssl: {
		rejectUnauthorized: false
	}
})

exports.index = (req, res) => {
	res.render('pages/index');
}

exports.login = (req, res) => {
	if (req.user) {
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
		res.redirect('/login');
	}
	else{
		pool.connect((error, client, release) => {
			client.query('select "left", budget from budget_parameter where user_id=$1', [req.user.id], (err, result) => {
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

exports.update = (req, res) => {
	if(!req.body.monthly && !req.body.left) {
		return res.status(400).send({
			message: "Budget params can not be empty."
		})
	}

	pool.connect((error, client, release) => {
		console.log(req.user.id)
		const query = 'update budget_parameter set "left"=$1, "budget"=$2 where user_id=$3';
		const values = [req.body.left, req.body.monthly, req.user.id];
		client.query(query, values, (err, result) => {
			release();
			if (err) {
				console.error(err);
				return res.send(err);
			}
			else {
				res.redirect('/budget');
			}
		})
	});
}