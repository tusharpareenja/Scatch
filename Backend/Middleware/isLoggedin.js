// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  console.log(req.cookie);
    let token = req.cookies.token
    console.log("Token:", req.cookies.token);
    if (!token) {
        return res.status(401).json({ message: "You must be logged in" });
    }
    
    try {
        const data = jwt.verify(token, process.env.JWT_KEY);
        req.user = data;
        next();
    } catch (error) {
        console.error("JWT verification failed:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "You must be logged in" });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};
