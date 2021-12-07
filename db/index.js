require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	client_encoding: 'iso-8859-1',
	ssl: {
		rejectUnauthorized: false
	}
})

module.exports = pool