const {v4: uuidv4} = require('uuid');
const bcrypt= require('bcrypt');

const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
})

exports.list = (req, res) => {
	pool.connect((error, client, release) => {
		client.query('select id, name from list where exists (select 1 from list_user where list_id = list.id and list_user.user_id = $1);', [req.user.id], (err, result) => {
			release();

			if (err) console.error(err);
			else {
				res.render('pages/shopping/lists', 
				{
					title:'Shopping list',
					user: req.user,
					lists: result.rows
				});
			}
		})
	})
}

exports.detail = (req, res) => {
	var params;
	pool.connect((error, client, release) => {
		client.query('select i.name, li.amount from list_item as li join item as i on i.id = li.item_id where li.list_id = $1', [req.params.list_id], (err, result) => {

			if (err) console.error(err);
			else {
				params = {
					title:'Shopping list',
					user: req.user,
					items: result.rows
				};
				client.query('select name from list where id = $1', [req.params.list_id], (err2, result2) => {
					release();

					if (err) console.error(err2);
					else {
						params.list = result2.rows[0].name;
						res.render('pages/shopping/detail', params);
					}
				})
			}
		})
	})
}