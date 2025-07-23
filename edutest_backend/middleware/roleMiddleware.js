// backend/middleware/roleMiddleware.js
/**
 * Middleware to restrict access based on user roles.
 * @param {Array<string>} roles - An array of roles allowed to access the route (e.g., ['admin', 'candidate']).
 */
const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error(
        "Not authorized, no user found in request (auth middleware missing)"
      );
    }

    if (!roles.includes(req.user.role)) {
      res.status(403); // Forbidden
      throw new Error(
        `Forbidden: User with role '${req.user.role}' is not authorized to access this route.`
      );
    }
    next();
  };
};

module.exports = { authorizeRoles };
