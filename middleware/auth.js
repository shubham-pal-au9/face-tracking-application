const Agora = require("agora-access-token");

module.exports = function (req, res, next) {
  //Get the tokrn form header
  const token = req.header("x-auth-token");

  // check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, Authorization denied" });
  }

  //veryfy the token
  /* try {
    const decoded = Agora.verify(token, config.get("secret"));
    req.channel = decoded.channel;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  } */
};