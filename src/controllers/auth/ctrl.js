const { generatePassword, verifyPassword } = require('../../lib/authentication');
const { runQuery } = require('../../lib/database');

// GET /auth/sign_in
const signInForm = async (req, res, next) => {
    try {
        const { user } = req.session;
        if (user) res.redirect('/');
        else res.render('auth/sign-in.pug', { user });
    } catch (err) {
        next(err);
    }
};

// POST /auth/sign_in
const signIn = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) throw new Error('BAD_REQUEST');

        const sql = 'SELECT * FROM users WHERE username = ?';
        const result = await runQuery(sql, [username]);
        if (!result.length) throw new Error('UNAUTHORIZED');

        const user = result[0];
        const isVerified = await verifyPassword(password, user.password);
        if (!isVerified) throw new Error('UNAUTHORIZED');
        
        req.session.user = {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            isActive: user.isActive,
            isStaff: user.isStaff,
        };
        return res.redirect('/');
    } catch (err) {
        next(err);
    }
};

// GET /auth/sign_up
const signUpForm = async (req, res, next) => {
    try {
        const { user } = req.session;
        res.render('auth/sign-up.pug', { user });
    } catch {
        next(err);
    }
};

// POST /auth/sign_up
const signUp = async (req, res, next) => {
    try {
        const { displayName, username, password } = req.body;

        if (!displayName || !username || !password) throw new Error('BAD_REQUEST');

        const hashedPassword = await generatePassword(password);
        const sql = 'INSERT INTO users (username, password, displayName) VALUES (?, ?, ?)';
        await runQuery(sql, [username, hashedPassword, displayName]);
        res.redirect('/auth/sign_in');
    } catch (err) {
        next(err);
    }
};

// GET /auth/sign_out
const signOut = async (req, res, next) => {
    try {
        req.session.destroy(err => {
            if (err) throw err;
        });
        res.redirect('/');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    signInForm,
    signIn,
    signUpForm,
    signUp,
    signOut,
};