const { Router } = require('express');

const indexCtrl = require('./ctrl');
const article = require('./article');
const auth = require('./auth');

const router = Router();

router.get('/', indexCtrl.indexPage);
router.get('/articles/page/:page(\\d+)', indexCtrl.listArticles);
router.get('/articles', indexCtrl.latestArticles);

router.use('/article', article);
router.use('/auth', auth);

module.exports = router;
