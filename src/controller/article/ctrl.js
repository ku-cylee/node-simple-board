const { ArticleDAO } = require('../../DAO');

// GET /article/:articleId(\\d+)
const readArticle = async (req, res, next) => {
    try {
		const { user } = req.session;
		const { articleId } = req.params;
		const article = await ArticleDAO.getById(parseInt(articleId, 10));
        return res.render('articles/details.pug', { user, article });
    } catch (err) {
        return next(err);
    }
};

// GET /article/compose
const writeArticleForm = async (req, res, next) => {
	try {
		const { user } = req.session;
		return res.render('articles/editor.pug', { user });
	} catch (err) {
		return next(err);
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
		
		const newArticleId = await ArticleDAO.create(trimmedTitle, trimmedContent, user);
		return res.redirect(`/article/${newArticleId}`);
	} catch (err) {
		return next(err);
	}
};

// GET /article/edit/:articleId(\\d+)
const editArticleForm = async (req, res, next) => {
	try {
		const { user } = req.session;
		const { articleId } = req.params;
		const articleIdNum = parseInt(articleId, 10);
		const article = await ArticleDAO.getByIdAndAuthor(articleIdNum, user);

		return res.render('articles/editor.pug', { user, article });
	} catch (err) {
		return next(err);
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

		await ArticleDAO.update(articleId, trimmedTitle, trimmedContent, user);
		return res.redirect(`/article/${articleId}`);
	} catch (err) {
		return next(err);
	}
};

// GET /article/delete/:articleId(\\d+)
const deleteArticle = async (req, res, next) => {
	try {
		const { user } = req.session;
		const { articleId } = req.params;

		await ArticleDAO.remove(articleId, user);
		return res.redirect('/articles/page/1');
	} catch (err) {
		return next(err);
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
