const util = require('util');
const crypto = require('crypto');

const { runQuery } = require('../../lib/database');

const pbkdf2 = util.promisify(crypto.pbkdf2);
const randomBytes = util.promisify(crypto.randomBytes);
const KEY_LEN = 64;

const comparePassword = async (password, storedPassword) => {
    const [algo, encodedSalt, iterStr, keylenStr, encodedDigest] = storedPassword.split(':');
    const iter = parseInt(iterStr);
    const keylen = parseInt(keylenStr);
    const salt = Buffer.from(encodedSalt, 'base64');
    const digest = Buffer.from(encodedDigest, 'base64');
    const hashed = await pbkdf2(password, salt, iter, keylen, algo);
    return Buffer.compare(hashed, digest) === 0;
};

const generatePassword = async password => {
    const ITER = 100000;
    const ALGO = 'sha512';
    const salt = await randomBytes(16);
    const digest = await pbkdf2(password, salt, ITER, KEY_LEN, ALGO);
    return `${ALGO}:${salt.toString('base64')}:${ITER}:${KEY_LEN}:${digest.toString('base64')}`;
};

// GET /auth/sign_in
const signInForm = async (req, res, next) => {
    try {
        if (req.session.user) res.redirect('/');
        else res.render('auth/sign-in.pug');
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
        const isEqualPassword = await comparePassword(password, user.password);
        if (!isEqualPassword) throw new Error('UNAUTHORIZED');
        
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
        res.render('auth/sign-up.pug');
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
