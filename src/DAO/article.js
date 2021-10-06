const { runQuery } = require('../lib/database');

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
    const sql = 'SELECT a.id, a.title, a.content, a.created_at AS createdAt,' +
                'a.last_updated AS lastUpdated, a.author, a.is_active AS isActive, ' +
                'a.is_deleted AS isDeleted, u.display_name AS displayName '  +
                'FROM articles AS a INNER JOIN users AS u ' +
                'ON a.author = u.id AND a.is_active = 1 AND a.is_deleted = 0 ' +
                'ORDER BY a.id DESC LIMIT ?, ?';
    const articles = await runQuery(sql, [start, count]);
    return articles.map(replaceDate);
};

const getTotalCount = async () => {
    const sql = 'SELECT Count(*) AS articleCount FROM articles ' +
                'WHERE is_active = 1 AND is_deleted = 0';
    const { count } = (await runQuery(sql))[0];
    return count;
};

const getById = async id => {
    const sql = 'SELECT a.id, a.title, a.content, a.created_at AS createdAt, ' +
                'a.last_updated AS lastUpdated, a.author, a.is_active AS isActive, ' +
                'a.is_deleted AS isDeleted, u.display_name AS displayName '  +
                'FROM articles AS a INNER JOIN users AS u ' +
                'ON a.id = ? AND a.author = u.id AND a.is_active = 1 AND a.is_deleted = 0';
    const articles = await runQuery(sql, [id]);
    if (!articles.length) throw new Error('NOT_FOUND');
    return replaceDate(articles[0]);
};

const getByIdAndAuthor = async (id, author) => {
    const sql = 'SELECT id, title, content, author, created_at AS createdAt, ' +
                'last_updated AS lastUpdated, is_active AS isActive, ' +
                'is_deleted AS isDeleted FROM articles ' +
                'WHERE id = ? AND author = ? AND is_active = 1 AND is_deleted = 0';
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
    const sql = 'UPDATE articles SET title = ?, content = ? ' +
                'WHERE id = ? AND author = ? AND is_active = 1 AND is_deleted = 0';
    const result = await runQuery(sql, [title, content, id, author.id]);
    if (!result.changedRows) throw new Error('NOT_FOUND');
};

const remove = async (id, author) => {
    const sql = 'UPDATE articles SET is_deleted = 1 ' +
                'WHERE id = ? AND author= ? AND is_active = 1 AND is_deleted = 0';
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
