const runQuery = require('../lib/database');

const getById = async id => {
    const sql = 'SELECT articles.*, users.displayName FROM articles ' + 
                'INNER JOIN users ON articles.author=users.id ' +
                'WHERE articles.id=? AND articles.isActive=1 AND articles.isDeleted=0';
    const articles = await runQuery(sql, [id]);
    if (!articles.length) throw new Error('NOT_FOUND');
    return articles[0];
};

const getByIdAndAuthor = async (id, author) => {
    const sql = 'SELECT * FROM articles ' +
                'WHERE id=? AND author=? AND isActive=1 AND isDeleted=0';
    const articles = await runQuery(sql, [id, author.id]);
    if (!articles.length) throw new Error('NOT_FOUND');
    return articles[0];
};

const create = async (title, content, author) => {
    const sql = 'INSERT INTO articles (title, content, author) VALUES (?, ?, ?)'
    const article = await runQuery(sql, [title, content, author.id]);
    return article.insertId;
};

const update = async (id, title, content) => {
    sql = 'UPDATE articles SET title=?, content=? WHERE id=?';
    await runQuery(sql, [title, content, id]);
};

const remove = async id => {
    sql = 'UPDATE articles SET isDeleted=1 WHERE id=?';
    await runQuery(sql, [id]);
};

module.exports = {
    getById,
    getByIdAndAuthor,
    create,
    update,
    remove,
};
