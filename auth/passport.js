const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Pool } = require('pg');
const bcrypt= require('bcrypt');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

module.exports = function(app) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(user_id, done) {
		pool.connect((err, client, release) => {
			client.query('select * from public.user where id=$1', [user_id], (err, result) => {
				release();
				if (err) return done(err);
				done(null, result.rows[0]);
			})
		})
	});

	passport.use(new LocalStrategy({passReqToCallback : true}, (req, username, password, done) => {
		pool.connect((error, client, release) => {
			if (error) {
				// req.flash('danger', error)
				console.error(error);
				return done(error, false);
			}
			else {
				client.query('select * from public.user where email=$1', [username], (err, result) => {
					release();
					
					if (err) return done(err);

					if (result.rowCount == 0) {
						// req.flash('danger', 'Incorrect username.')
						return done(null, false)
					}
					bcrypt.compare(password, result.rows[0].password, function(err, check) {
						if (err){
							done(err);
						}
						else if (check){
							// req.flash('success', 'Woho');
							var user = result.rows[0];
							done(null, {
								id: user.id, 
								username: user.email, 
								firstName: user.firstname, 
								lastName: user.lastname
							});
						}
						else{
							// req.flash('danger', 'Incorrect password');
							done(null, false);
						}
					});
				})
			}
		})
	}))
}
