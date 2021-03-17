const {v4: uuidv4} = require('uuid');
const bcrypt= require('bcrypt');

const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
})


exports.index = (req, res) => {
	pool.connect((error, client, release) => {
		client.query('select name, lead, description from apps', (err, result) => {
			release();

			if (err) console.error(err);
			else {
				res.render('pages/index', {
					title: 'Home',
					apps: result.rows,
					user: req.user
				});
			}
		})
	})
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

exports.signup = (req, res) => {
	pool.connect((error, client, release) => {
		bcrypt.hash(req.body.password, 5, (err, hash) => {
			const query = 'insert into public.user (id, firstname, lastname, email, password) values ($1, $2, $3, $4, $5)';
			const values = [uuidv4(), req.body.firstname, req.body.lastname, req.body.username, hash];
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
		});
	})
}