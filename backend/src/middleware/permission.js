const permission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      // Check if user exists (should be set by auth middleware)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.'
        });
      }

      // Admin users have all permissions
      if (req.user.role === 'admin') {
        return next();
      }

      // Check if user has the required permission
      if (!req.user.permissions.includes(requiredPermission)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required permission: ${requiredPermission}`,
          userRole: req.user.role,
          userPermissions: req.user.permissions
        });
      }

      next();

    } catch (error) {
      console.error('Permission middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error in permission check.'
      });
    }
  };
};

module.exports = permission;