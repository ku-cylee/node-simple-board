require('./env');
const app = require('./app');

const port = process.env || 4000;

app.listen(port, () => {
	console.log(`KWEB Project: Listening on port ${port}.`);
});
