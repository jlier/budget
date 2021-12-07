const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt= require('bcrypt')

const db = require('../db/index')

passport.serializeUser((user, done) => {
	done(null, user.id)
})

passport.deserializeUser((user_id, done) => {
	db.query('select * from dash_user where id=$1', [user_id], (err, result) => {
		if(err) return done(err)
		done(null, result.rows[0])
	})
})

passport.use(new LocalStrategy({passReqToCallback : true}, (req, username, password, done) => {
	db.query('select * from dash_user where email=$1', [username], (err, result) => {
		if(err) return done(err)

		if(result.rowCount == 0) {
			return done(null, false)
		}
		bcrypt.compare(password, result.rows[0].password, (err, check) => {
			if (err) done(err)

			else if (check) {
				const user = result.rows[0]
				done(null, {
					id: user.id, 
					username: user.email, 
					firstName: user.firstname, 
					lastName: user.lastname
				})
			}
			else {
				done(null, false)
			}
		})
	})
}))

module.exports = passport