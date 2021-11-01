const {v4: uuidv4} = require('uuid');
const bcrypt= require('bcrypt');

const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
})

exports.movies = (req, res) => {
	res.render('pages/movies/movies');
}