const { Pool } = require('pg');
const {v4: uuidv4} = require('uuid');
const bcrypt= require('bcrypt');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
})

exports.index = (req, res) => {
	res.render('pages/index', {
		title: 'Daskebrett'
	});
}

exports.login = (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/budget');
	}
	else {
		res.render('pages/login', {
			title: 'Login'
		});
	}
}

exports.signupform = (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/budget');
	}
	else {
		res.render('pages/signup', {
			title: 'Signup'
		})
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
						title: 'Budsjett',
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

exports.signup = (req, res) => {
	pool.connect((error, client, release) => {
		const query = 'insert into public.user (id, firstname, lastname, email, password) values ($1, $2, $3, $4, $5)';
		const values = [uuidv4(), req.body.firstname, req.body.lastname, req.body.username, bcrypt.hash(req.body.password, 5)];
		client.query(query, values, (err, result) => {
			release();
			if (err) {
				console.error(err);
				return res.send(err);
			}
			else {
				res.redirect('/login');
			}
		})
	})
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