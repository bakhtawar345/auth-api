const jwt = require('jsonwebtoken'); //need to verify incoming tokens

const verifyToken = (req, res, next) =>{
    // next() passes the request along to the actual route, if u dont call
    // the request gets stuck
    const token = req.headers['authorization'];

    if (!token){
        return res.status(401).json({ message: 'no token provided'});
    }

    try {
        const decoded= jwt.verify(token, process.env.JWT_SECRET); 
        // verifies if token was made with the secret key and has it expired
        req.user = decoded; //attatch the data to the request object so the 
        //route can access it and know who's making the request
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