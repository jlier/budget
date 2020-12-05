const express = require('express');
const app = express();

require('dotenv').config();

const path = require('path');

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const session = require('express-session');
app.use(session({
		secret: process.env.secret,
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 365
		}
	}
));

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./routes/routes')(app);

app.use(express.static(__dirname + '/public'));

app.set('views', (__dirname + '/views'));
app.set('view engine', 'pug');

const PORT = process.env.PORT || 5678;

app.listen(PORT, () => console.log("Server is listening on port", PORT))