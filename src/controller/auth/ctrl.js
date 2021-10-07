const { UserDAO } = require('../../DAO');
const { generatePassword, verifyPassword } = require('../../lib/authentication');

// GET /auth/sign_in
const signInForm = async (req, res, next) => {
    try {
        const { user } = req.session;
        if (user) return res.redirect('/');
        else return res.render('auth/sign-in.pug', { user });
    } catch (err) {
        next(err);
    }
};

// POST /auth/sign_in
const signIn = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) throw new Error('BAD_REQUEST');

        const user = await UserDAO.getByUsername(username);
        if (!user) throw new Error('UNAUTHORIZED');
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) throw new Error('UNAUTHORIZED');

        req.session.user = {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            isActive: user.isActive,
            isStaff: user.isStaff,
        };
        return res.redirect('/');
    } catch (err) {
        return next(err);
    }
};

// GET /auth/sign_up
const signUpForm = async (req, res, next) => {
    try {
        const { user } = req.session;
        return res.render('auth/sign-up.pug', { user });
    } catch {
        return next(err);
    }
};

// POST /auth/sign_up
const signUp = async (req, res, next) => {
    try {
        const { username, password, displayName } = req.body;
        if (!username || !password || !displayName) throw new Error('BAD_REQUEST');

        const hashedPassword = await generatePassword(password);
        await UserDAO.create(username, hashedPassword, displayName);

        return res.redirect('/auth/sign_in');
    } catch (err) {
        return next(err);
    }
};

// GET /auth/sign_out
const signOut = async (req, res, next) => {
    try {
        req.session.destroy(err => {
            if (err) throw err;
            else return res.redirect('/');
        });
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    signInForm,
    signIn,
    signUpForm,
    signUp,
    signOut,
};
