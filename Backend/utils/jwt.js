const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN })
}

const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN })
}

const authenticateAccessToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (token == null) { return res.status(401).send("Not authorized") }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (error, user) => {
        if (error && error.name === 'TokenExpiredError') { return res.status(401).send({ error: 'token_expired', message: 'Access token has expired' }) }
        else if (error) { return res.status(403).send("Error: " + error) }
        req.user = user;
        next()
    })
}

const authenticateRefreshToken = (req, res, next) => {
    const token = req.cookies.refreshToken;
    if (token == null) { return res.status(401).send("Not authorized") }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (error, user) => {
        if (error && error.name === 'TokenExpiredError') { return res.status(401).send({ error: 'token_expired', message: 'Refresh token has expired' }) }
        else if (error) { return res.status(403).send("Error: " + error) }
        req.user = user;
        next()
    })
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    authenticateAccessToken,
    authenticateRefreshToken
}