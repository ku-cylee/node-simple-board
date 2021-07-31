const util = require('util');
const crypto = require('crypto');

const pbkdf2 = util.promisify(crypto.pbkdf2);
const randomBytes = util.promisify(crypto.randomBytes);

const generatePassword = async password => {
    const ALGO = 'sha512';
    const salt = await randomBytes(32);
    const iter = Math.floor(Math.random() * 20000) + 100000;
    const KEY_LEN = 64;

    const digest = await pbkdf2(password, salt, iter, KEY_LEN, ALGO);
    return `${ALGO}:${salt.toString('hex')}:${iter}:${KEY_LEN}:${digest.toString('hex')}`;
};

const verifyPassword = async (password, hashedPassword) => {
    const [algo, encodedSalt, iterStr, keyLenStr, encodedDigest] = hashedPassword.split(':');
    const salt = Buffer.from(encodedSalt, 'hex');
    const iter = parseInt(iterStr, 10);
    const keyLen = parseInt(keyLenStr, 10);
    const storedDigest = Buffer.from(encodedDigest, 'hex');

    const digest = await pbkdf2(password, salt, iter, keyLen, algo);
    return Buffer.compare(digest, storedDigest) === 0;
};

module.exports = { generatePassword, verifyPassword };
