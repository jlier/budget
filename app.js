const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./db/index').getPool()

const passport = require('passport');

require('dotenv').config();

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
		// secure: true,
		maxAge: 1000 * 60 * 60 * 24 * 365
	}
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

require('./routes/routes')(app);

app.use(express.static(__dirname + '/public'));

app.set('views', (__dirname + '/views'));
app.set('view engine', 'pug');

const PORT = process.env.PORT || 5678;

app.listen(PORT, () => console.log("Server is listening on port", PORT))