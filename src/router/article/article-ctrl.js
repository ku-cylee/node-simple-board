const { runQuery } = require('../../lib/database');

// GET /article/:articleId(\\d+)
const readArticle = async (req, res, next) => {
    try {
		const { user } = req.session;
		const { articleId } = req.params;
		const articleIdNum = parseInt(articleId);
        const sql = 'SELECT articles.*, users.displayName FROM articles ' + 
                    'INNER JOIN users ON articles.author = users.id ' +
					'WHERE articles.id = ? AND articles.isActive = 1 AND articles.isDeleted = 0';
		const result = await runQuery(sql, [articleIdNum]);
		if (!result.length) throw new Error('NOT_EXIST');

		const article = result[0];
        res.render('articles/details.pug', { article, user });
    } catch (err) {
        next(err);
    }
};

// GET /article/compose
const writeArticleForm = async (req, res, next) => {
	try {
		const { user } = req.session;
		res.render('articles/compose.pug', { user });
	} catch (err) {
		next(err);
	}
};

// POST /article/compose
const writeArticle = async (req, res, next) => {
	try {
		const { user } = req.session;
		const { title, content } = req.body;
		const trimmedTitle = title.trim();
		const trimmedContent = content.trim();

		if (!trimmedTitle || !trimmedContent) throw new Error('BAD_REQUEST');
		
		const sql = 'INSERT INTO articles (title, content, author) VALUES (?, ?, ?)'
		const article = await runQuery(sql, [trimmedTitle, trimmedContent, user.id]);
		res.redirect(`/article/${article.insertId}`);
	} catch (err) {
		next(err);
	}
};

// GET /article/edit/:articleId(\\d+)
const editArticleForm = async (req, res, next) => {
	try {
		const { user } = req.session;
		const { articleId } = req.params;
		const articleIdNum = parseInt(articleId);

		const sql = 'SELECT * FROM articles WHERE id = ? AND isActive = 1 AND isDeleted = 0';
		const articles = await runQuery(sql, [articleIdNum]);

		if (!articles.length) throw new Error('NOT_EXIST');
		const article = articles[0];

		res.render('articles/compose.pug', { article, user });
	} catch (err) {
		next(err);
	}
};

// POST /article/edit/:articleId(\\d+)
const editArticle = async (req, res, next) => {
	try {
		const { user } = req.session;
		const { articleId } = req.params;
		const { title, content } = req.body;
		const trimmedTitle = title.trim();
		const trimmedContent = content.trim();

		if (!trimmedTitle || !trimmedContent) throw new Error('BAD_REQUEST');

		const selectSql = 'SELECT id FROM articles WHERE id = ? AND author = ?';
		const articles = await runQuery(selectSql, [articleId, user.id]);
		if (!articles.length) throw new Error('NOT_EXIST');
		const article = articles[0];

		const sql = 'UPDATE articles SET title = ?, content = ? WHERE id = ?';
		await runQuery(sql, [trimmedTitle, trimmedContent, article.id]);
		res.redirect(`/article/${article.id}`);
	} catch (err) {
		next(err);
	}
};

// GET /article/delete/:articleId(\\d+)
const deleteArticle = async (req, res, next) => {
	try {
		const { user } = req.session;
		const { articleId } = req.params;
		let sql = 'SELECT id FROM articles ' + 
				  'WHERE id = ? AND author = ? AND isActive = 1 AND isDeleted = 0';
		const articles = await runQuery(sql, [articleId, user.id]);

		if (!articles.length) throw new Error('NOT_EXIST');
	
		sql = 'UPDATE articles SET isDeleted = 1 WHERE id = ?';
		await runQuery(sql, [articles[0].id]);
		
		res.redirect('/articles/page/1');
	} catch (err) {
		next(err);
	}
};

module.exports = {
    readArticle,
    writeArticleForm,
    writeArticle,
    editArticleForm,
    editArticle,
    deleteArticle,
};
