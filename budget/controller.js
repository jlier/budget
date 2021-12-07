const db = require('../db/index')

exports.budget = (req, res) => {
	db.query('select left_of_budget, budget from budget_parameter where user_id=$1', [req.user.id], (err, result) => {
		if (err) {
			console.error(err)
			return
		}
		parameters = {
			title: 'Budsjett',
			monthly: result.rows[0].budget,
			left: result.rows[0].left_of_budget,
			user: req.user
		}
		return res.render('pages/budget', parameters)
	})
}

exports.update = (req, res) => {
	const query = 'update budget_parameter set left_of_budget=$1, budget=$2 where user_id=$3'
	const values = [req.body.left, req.body.monthly, req.user.id]
	db.query(query, values, (err, result) => {
		if (err) {
			console.error(err)
			return res.send(err)
		}
		res.redirect('/budget')
	})
}