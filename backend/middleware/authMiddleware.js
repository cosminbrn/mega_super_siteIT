
const authMiddleware = (req, res, next) => {
    // Add your authentication logic here

    next();
};

module.exports = authMiddleware;