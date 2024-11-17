

const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = await User.findById(decoded.id);
        if (!req.user) throw new Error();
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = auth;
