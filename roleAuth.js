const User = require('../models/user');

const roleAuth = (roles) => {
    return async (req, res, next) => {
        try {
            // Assuming JWT token is passed in the Authorization header
            const token = req.header('Authorization').replace('Bearer ', '');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!roles.includes(user.role)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            // Attach user information to request for further processing
            req.user = user;
            next(); // Proceed to the next middleware or route handler
        } catch (err) {
            res.status(401).json({ message: 'Not authorized' });
        }
    };
};

module.exports = roleAuth;