module.exports = function () {
	require('dotenv').config();
	var passport = require('passport');
	var LocalStrategy = require('passport-local').Strategy;
	const { Pool } = require('pg');
	const bcrypt = require('bcrypt');

	const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false
		}
	});
	
	passport.use(new LocalStrategy({passReqToCallback : true}, (req, username, password, done) => {
		pool.connect((error, client, release) => {
			if (error) {
				// req.flash('danger', error)
				console.error(error);
				return done(error, false);
			}
			else {
				console.log("NOT ERROR");
				client.query('select * from public.user where email=$1', [username], (err, result) => {
					release();
					
					if (err) return done(err);

					if (result.rowCount == 0) {
						// req.flash('danger', 'Incorrect username.')
						return done(null, false)
					}
					bcrypt.compare(password, result.rows[0].password, function(err, check) {
						console.log("Comparing passwords");
						if (err){
							console.log('Error while checking password');
							done(err);
						}
						else if (check){
							console.log("SUCCESS");
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
							console.log("NOT SURE");
							// req.flash('danger', 'Incorrect password');
							done(null, false);
						}
					});
				})
			}
		})
	}))

	passport.use(new BearerStrategy(
  		function(token, done) {
    		User.findOne({ token: token }, function (err, user) {
      			if (err) { return done(err); }
      			if (!user) { return done(null, false); }
      			return done(null, user, { scope: 'all' });
    		});
  		}
	));
};