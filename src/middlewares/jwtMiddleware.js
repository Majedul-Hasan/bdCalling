var jwt = require('jsonwebtoken');

const signJwt = (id, role) =>
  jwt.sign({ userId: id, role: role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

module.exports = { signJwt };
