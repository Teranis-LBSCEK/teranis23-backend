const jwt = require("jsonwebtoken");

const Ambassador = require('../models/Ambassador')

const authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    try{
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if(err) {
                    return res.status(401).json({
                      success: false,
                      message: "Jwt Verification Failed",
                      data: err.message,
                    });
                }
                if(!roles.includes(decoded.user.role)) {
                    return res.status(401).json({
                      success: false,
                      message: "Unauthorized request",
                    });
                }
                if(decoded.user.role === "admin") {
                  req.user = { id: "admin" };
                  req.user.role = decoded.user.role
                  next();
                } else {
                  const user = await Ambassador.findById(decoded.user.id);
                  if (!user) {
                      return res.status(401).json({
                        success: false,
                        message: "No user exist with the token",
                      });
                  }
                  
                  req.user = user;
                  req.user.role = decoded.user.role
                  next();
                }
            })
        } else {
            return res.status(401).json({
              success: false,
              message: "jwt token is not provided",
            });
        }
      }catch (err){
          return res.status(401).json({
            success: false,
            message: err.message,
          });
      }
  }
};

module.exports = authorize;