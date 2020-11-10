require('./env');
const app = require('./app');

const { PORT } = process.env;
const port = PORT || 4000;

app.listen(port, () => {
	console.log(`KWEB Project: Listening on port ${port}.`);
});
