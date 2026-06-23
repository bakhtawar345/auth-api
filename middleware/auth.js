const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) =>{
    const token = req.headers['authorization'];

    if (!token){
        return res.status(401).json({ message: 'no token provided'});
    }

    try {
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token'});
    }
};

const verifyAdmin = (req, res, next) => {
    if( req.user.role !== 'admin'){
        return res.status(403).json({ message: 'Acess denied. Admins only. '});
    }
    next();
};

module.exports = { verifyToken, verifyAdmin};