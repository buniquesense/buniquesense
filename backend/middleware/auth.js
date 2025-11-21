const jwt = require('jsonwebtoken');
const User = require('../models/User');

const jwtSecret = process.env.JWT_SECRET || 'shh';

async function authenticate(req, res, next){
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({message:'No token'});
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.id);
    if(!user) return res.status(401).json({message:'Invalid token'});
    req.user = user;
    next();
  } catch(e){
    return res.status(401).json({message:'Invalid token'});
  }
}

function authorizeRole(...allowedRoles){
  return (req, res, next) => {
    if(!req.user) return res.status(401).json({message:'Not authenticated'});
    if(!allowedRoles.includes(req.user.role)) return res.status(403).json({message:'Forbidden'});
    next();
  };
}

module.exports = { authenticate, authorizeRole };
