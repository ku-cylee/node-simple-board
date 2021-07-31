const runQuery = require('../lib/database');

const formatDate = date => {
    const yr = date.getFullYear();
    const mon = date.getMonth() + 1;
    const dt = date.getDate();
    const hrs = date.getHours();
    const mins = date.getMinutes();
    const secs = date.getSeconds();
    return `${yr}. ${mon}. ${dt} ${hrs}:${mins}:${secs}`;
};

const replaceDate = article => {
    article.createdAt = formatDate(article.createdAt);
    article.lastUpdated = formatDate(article.lastUpdated);
    return article;
};

const getList = async (start, count) => {
    const sql = 'SELECT articles.*, users.displayName FROM articles ' +
                'INNER JOIN users ON articles.author = users.id ' +
                'WHERE articles.isActive = 1 AND articles.isDeleted = 0 ' + 
                'ORDER BY articles.id DESC LIMIT ?, ?';
    const articles = await runQuery(sql, [start, count]);
    return articles.map(replaceDate);
};

const getTotalCount = async () => {
    const sql = 'SELECT COUNT(id) AS articleCount FROM articles ' +
                'WHERE isActive = 1 AND isDeleted = 0';
    const { count } = (await runQuery(sql))[0];
    return count;
};

const getById = async id => {
    const sql = 'SELECT articles.*, users.displayName FROM articles ' + 
                'INNER JOIN users ON articles.author=users.id ' +
                'WHERE articles.id=? AND articles.isActive=1 AND articles.isDeleted=0';
    const articles = await runQuery(sql, [id]);
    if (!articles.length) throw new Error('NOT_FOUND');
    return replaceDate(articles[0]);
};

const getByIdAndAuthor = async (id, author) => {
    const sql = 'SELECT * FROM articles ' +
                'WHERE id=? AND author=? AND isActive=1 AND isDeleted=0';
    const articles = await runQuery(sql, [id, author.id]);
    if (!articles.length) throw new Error('NOT_FOUND');
    return replaceDate(articles[0]);
};

const create = async (title, content, author) => {
    const sql = 'INSERT INTO articles (title, content, author) VALUES (?, ?, ?)'
    const result = await runQuery(sql, [title, content, author.id]);
    return result.insertId;
};

const update = async (id, title, content, author) => {
    const sql = 'UPDATE articles SET title=?, content=? ' +
                'WHERE id=? AND author=? AND isActive=1 AND isDeleted=0';
    const result = await runQuery(sql, [title, content, id, author.id]);
    if (!result.changedRows) throw new Error('NOT_FOUND');
};

const remove = async (id, author) => {
    const sql = 'UPDATE articles SET isDeleted=1 ' +
                'WHERE id=? AND author=? AND isActive=1 AND isDeleted=0';
    const result = await runQuery(sql, [id, author.id]);
    if (!result.changedRows) throw new Error('NOT_FOUND');
};

module.exports = {
    getList,
    getTotalCount,
    getById,
    getByIdAndAuthor,
    create,
    update,
    remove,
};
