const { Router } = require('express');

const authCtrl = require('./ctrl');

const router = Router();

// sign_in
router.get('/sign_in', authCtrl.signInForm);
router.post('/sign_in', authCtrl.signIn);

// sign_up
router.get('/sign_up', authCtrl.signUpForm);
router.post('/sign_up', authCtrl.signUp);

// sign_out
router.get('/sign_out', authCtrl.signOut);

module.exports = router;
