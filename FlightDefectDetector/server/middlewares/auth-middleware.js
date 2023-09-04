const { expressjwt: jwt } = require("express-jwt");
const jwks = require("jwks-rsa");
const axios = require("axios");

const verifyJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-jafsbarbai4xfwrh.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "MyExpressAPI",
  issuer: "https://dev-jafsbarbai4xfwrh.us.auth0.com/",
  algorithms: ["RS256"],
});

const setupUserInfo = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    axios
      .get("https://dev-jafsbarbai4xfwrh.us.auth0.com/userinfo", {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        req.user = response.data;
        console.log(req.user);
        next();
      })
      .catch((err) => {
        console.log(err.message);
      });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { verifyJwt, setupUserInfo };
