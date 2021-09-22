const { runQuery } = require('../lib/database');

const getByUsername = async username => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const result = await runQuery(sql, [username]);
    if (!result.length) throw new Error('UNAUTHORIZED');
    return result[0];
};

const create = async (username, password, displayName) => {
    const sql = 'INSERT INTO users (username, password, displayName) VALUES (?, ?, ?)';
    await runQuery(sql, [username, password, displayName]);
};

module.exports = { getByUsername, create };
