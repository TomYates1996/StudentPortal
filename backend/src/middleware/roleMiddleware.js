module.exports = function(allowedRoles = []) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ msg: 'Authorization denied' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Access forbidden: insufficient permissions' });
        }

        next();
    };
};
