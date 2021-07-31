const { runQuery } = require('../../lib/database');
const { articleDAO } = require('../../DAOs');

// GET /article/:articleId(\\d+)
const readArticle = async (req, res, next) => {
    try {
		const { user } = req.session;
		const { articleId } = req.params;
		const article = await articleDAO.getById(parseInt(articleId, 10));
        res.render('articles/details.pug', { user, article });
    } catch (err) {
        next(err);
    }
};

// GET /article/compose
const writeArticleForm = async (req, res, next) => {
	try {
		const { user } = req.session;
		res.render('articles/editor.pug', { user });
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
		
		const newArticleId = await articleDAO.create(trimmedTitle, trimmedContent, user);
		res.redirect(`/article/${newArticleId}`);
	} catch (err) {
		next(err);
	}
};

// GET /article/edit/:articleId(\\d+)
const editArticleForm = async (req, res, next) => {
	try {
		const { user } = req.session;
		const { articleId } = req.params;
		const articleIdNum = parseInt(articleId, 10);
		const article = await articleDAO.getByIdAndAuthor(articleIdNum, user);

		res.render('articles/editor.pug', { user, article });
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

		const article = await articleDAO.getByIdAndAuthor(articleId, user.id);
		await articleDAO.update(trimmedTitle, trimmedContent, article.id);
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

		await articleDAO.getByIdAndAuthor(articleId, user);
		await articleDAO.remove(articleId);
		
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
