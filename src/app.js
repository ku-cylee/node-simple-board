const express = require('express');
const logger = require('morgan');
const session = require('express-session');

const controller = require('./controllers');
const { errorHandler } = require('./lib/error-handler');

const app = express();

app.set('views', `${__dirname}/../views`);
app.set('view engine', 'pug');

app.use('/', express.static(`${__dirname}/../public`));

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
}));

app.use('/', controller);

app.use(errorHandler);

module.exports = app;
