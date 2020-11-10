const express = require('express');
const logger = require('morgan');
const session = require('express-session');
const router = require('./router');
const { errorHandler } = require('./lib/error-handler');

const app = express();

app.set('views', `${__dirname}/../templates`);
app.set('view engine', 'pug');

app.use('/', express.static(`${__dirname}/../public`));

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
	secret: '!@#$%^&*()',
	resave: false,
	saveUninitialized: true,
}));

app.use('/', router);

app.use(errorHandler);

module.exports = app;
