// imports
const express 		= require('express');
const bodyParser 	= require('body-parser');
const path			= require('path');
const cookieParser 	= require('cookie-parser');
const session 		= require('express-session');
const pgSession 	= require('connect-pg-simple')(session);
const pool 			= require('./db/index').getPool()
const passport 		= require('passport');

// set port number
const PORT = process.env.PORT || 5678;

// init express
const app = express();

// cookie and sessions
app.use(cookieParser());
app.use(session({
	store: new pgSession({
		pool: pool,
		tableName: 'session'
	}),
	name: 'sid',
	secret: process.env.secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 365
	}
}));

// init body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// init passport
app.use(passport.initialize());
app.use(passport.session());

// include budget routes
app.use('/budget', require('./budget/routes'));

// include user routes
app.use('/', require('./user/routes'));

// public folder
app.use(express.static(__dirname + '/public'));

// view
app.set('views', (__dirname + '/views'));
app.set('view engine', 'pug');

// start app
app.listen(PORT, () => console.log("Server is listening on port", PORT))