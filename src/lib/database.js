const mysql = require('mysql2/promise');

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;

const pool = mysql.createPool({
	host: DB_HOST || 'localhost',
	port: DB_PORT || 3306,
	user: DB_USER,
	password: DB_PASS,
	database: DB_NAME,
});

const runQuery = async (query, data) => {
	try {
		const conn = await pool.getConnection();
		try {
			const sql = conn.format(query, data);
			const [result] = await conn.query(sql);
			conn.release();
			return result;
		} catch (e) {
			conn.release();
			throw e;
		}
	} catch (e) {
		throw (e);
	}
};

module.exports = { runQuery };
