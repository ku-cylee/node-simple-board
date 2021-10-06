const getAlertScript = msg => `<script>alert("${msg}");history.back();</script>`;

const errorHandler = (err, req, res, next) => {
    switch (err.message) {
        case 'BAD_REQUEST':
            return res.send(getAlertScript('Invalid parameters!'));
        case 'UNAUTHORIZED':
            return res.send(getAlertScript('Login failure!'));
        case 'NOT_FOUND':
            return res.sendStatus(404);
        default:
            if (process.env.MODE !== 'prod') console.error('\x1b[31m%s\x1b[0m', err);
            return res.sendStatus(500);
    }
};

module.exports = { errorHandler };
