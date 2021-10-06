const { runQuery } = require('../lib/database');

const getByUsername = async username => {
    const sql = 'SELECT id, username, display_name AS displayName, password, ' +
                'date_joined as dateJoined, is_active AS isActive, ' +
                'is_staff as isStaff FROM users WHERE username = ?';
    const result = await runQuery(sql, [username]);
    if (!result.length) throw new Error('UNAUTHORIZED');
    return result[0];
};

const create = async (username, password, displayName) => {
    const sql = 'INSERT INTO users (username, password, display_name) VALUES (?, ?, ?)';
    await runQuery(sql, [username, password, displayName]);
};

module.exports = { getByUsername, create };
