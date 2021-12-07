const bcrypt= require('bcrypt')

const db = require('../db/index')

// get index page
exports.index = (req, res) => {
	db.query('select name, lead, description from apps', (err, result) => {
		if (err) {
			console.error(err)
			return
		}

		res.render('pages/index', {
			title: 'Home',
			apps: result.rows,
			user: req.user
		})
	})
}

// get login page
exports.login = (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/')
	}
	else {
		res.render('pages/login', {
			title: 'Login'
		})
	}
}

// get signup page
exports.signupform = (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/budget/')
	}
	else {
		res.render('pages/signup', {
			title: 'Signup'
		})
	}
}

// logout user
exports.logout = (req, res) => {
	req.logout()
	res.redirect('/')
}

// create user 
exports.signup = async (req, res) => {
	const hash = await bcrypt.hash(req.body.password, 10)
		
	const insert_query = 'insert into dash_user (firstname, lastname, email, password) values ($1, $2, $3, $4) returning id'
	const insert_values = [req.body.firstname, req.body.lastname, req.body.username, hash]
	
	try {
		const user_id = await db.query(insert_query, insert_values)

		const insert_budget_query = 'insert into budget_parameter (left_of_budget, budget, user_id) values (10000, 10000, $1)'
		const insert_budget_values = [user_id.rows[0].id]

		await db.query(insert_budget_query, insert_budget_values)
	}
	catch (e) {
		console.error(e)
	}
	finally {
		res.redirect('/login')
	}
}