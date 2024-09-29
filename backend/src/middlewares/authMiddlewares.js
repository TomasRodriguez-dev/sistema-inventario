const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../configuration/envs');

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, autorización denegada' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};

module.exports = auth;