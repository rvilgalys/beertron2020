const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // check headers!
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1]; // Authorizaiton: Bearer <token>
  if (!token || token === " ") {
    req.isAuth = false;
    return next();
  }
  // check token
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    // redundancy but why not
    req.isAuth = false;
    return next();
  }
  // if we made it down here things are valid
  req.isAuth = true;
  req.userID = decodedToken.userID;
  return next();
};
