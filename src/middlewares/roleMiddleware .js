const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access.',
        errorDetails: `You must be an ${
          allowedRoles[0] === 'admin' ? 'ADMIN' : allowedRoles[0]
        } to perform this action.`,
      });
    }

    next();
  };
};

module.exports = { roleMiddleware };
