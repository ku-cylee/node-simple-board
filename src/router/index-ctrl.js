const { runQuery } = require('../lib/database');

// GET /
const indexPage = async (req, res, next) => {
    try {
        const { user } = req.session;
        res.render('index.pug', { user });
    } catch (err) {
        next(err);
    }
};

// GET /articles/page/:page(\\d+)
const listArticles = async (req, res, next) => {
    try {
        const { page } = req.params;
        const { user } = req.session;
        const pageNum = parseInt(page);
        if (pageNum <= 0) throw new Error('BAD_REQUEST');

        const ARTICLES_PER_PAGE = 10;
        const startIndex = (pageNum - 1) * ARTICLES_PER_PAGE;

        let sql = 'SELECT articles.*, users.displayName FROM articles ' +
                  'INNER JOIN users ON articles.author = users.id ' +
                  'WHERE articles.isActive = 1 AND articles.isDeleted = 0 ' + 
                  'ORDER BY articles.id DESC LIMIT ?, ?';
        const articles = await runQuery(sql, [startIndex, ARTICLES_PER_PAGE]);

        sql = 'SELECT COUNT(id) AS articleCount FROM articles ' +
              'WHERE isActive = 1 AND isDeleted = 0';
        const { articleCount } = (await runQuery(sql))[0];
        const pageCount = Math.ceil(articleCount / ARTICLES_PER_PAGE);

        res.render('articles/index.pug', {
            user,
            articles,
            page: pageNum, 
            hasPrev: pageNum > 1, 
            hasNext: pageNum < pageCount,
        });
    } catch (err) {
        next(err)
    }
};

// GET /articles
const latestArticles = async (req, res, next) => {
    try {
        res.redirect('/articles/page/1');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    indexPage,
    listArticles,
    latestArticles,
};
