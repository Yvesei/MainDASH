const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }
      req.user = decoded;
      next();
      // return res.status(200).send(req.user);
    });
  } else {
    return res.status(403).json({ error: "Token not provided" });
  }
};

module.exports = {
  verifyToken,
};
