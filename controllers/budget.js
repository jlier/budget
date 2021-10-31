const {v4: uuidv4} = require('uuid');
const bcrypt= require('bcrypt');

const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
})

exports.budget = (req, res) => {
	if(!req.isAuthenticated()) {
		res.redirect('/login');
	}
	else{
		pool.connect((error, client, release) => {
			client.query('select left_of_budget, budget from budget_parameter where user_id=$1', [req.user.id], (err, result) => {
				release();

				if (err) console.error(err);
				else {
					parameters = {
						title: 'Budsjett',
						monthly: result.rows[0].budget,
						left: result.rows[0].left_of_budget,
						user: req.user
					}
					res.render('pages/budget/budget', parameters);
					return;
				}
			})
		});
	}
}

exports.update = (req, res) => {
	if(!req.isAuthenticated()) {
		res.redirect('/login');
		return;
	}
	
	// TODO: Do this client side
	if(!req.body.monthly && !req.body.left) {
		return res.status(400).send({
			message: "Budget params can not be empty."
		})
	}

	pool.connect((error, client, release) => {
		const query = 'update budget_parameter set left_of_budget=$1, budget=$2 where user_id=$3';
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