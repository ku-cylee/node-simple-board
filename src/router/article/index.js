const { Router } = require('express');

const { authRequired } = require('../auth/middleware');
const articleCtrl = require('./article-ctrl');

const router = Router();

// single article
router.get('/:articleId(\\d+)', articleCtrl.readArticle);

// compose article
router.get('/compose', authRequired, articleCtrl.writeArticleForm);
router.post('/compose', authRequired, articleCtrl.writeArticle);

// edit article
router.get('/edit/:articleId(\\d+)', authRequired, articleCtrl.editArticleForm);
router.post('/edit/:articleId(\\d+)', authRequired, articleCtrl.editArticle);

// delete article
router.get('/delete/:articleId(\\d+)', authRequired, articleCtrl.deleteArticle);

module.exports = router;
