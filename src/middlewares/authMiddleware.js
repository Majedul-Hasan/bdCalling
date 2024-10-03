const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // Get the token from the request headers, query parameters, or cookies

  let token;
  if (req.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
  }

  try {
    console.log(token);
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);
    // Attach the decoded user information to the request object
    req.user = decoded;

    // Continue to the next middleware or route
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { authMiddleware };
