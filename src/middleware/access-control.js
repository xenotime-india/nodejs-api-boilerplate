import authenticate from './authenticate';
import config from 'config';

export default function accessControl(role) {
  if (!role) {
    throw new Error('Provide a role.');
  }

  const requiredRoleIndex = config.userRoles.indexOf(role);

  if (requiredRoleIndex < 0) {
    throw new Error('Not a valid role.');
  }

  return (req, res, next) => authenticate(req, res, (err) => {
    const currentRoleIndex = config.userRoles.indexOf(req.currentUser.role);

    if (
      err ||
      !req.currentUser ||
      currentRoleIndex < requiredRoleIndex
    ) {
      res.sendStatus(403);
      return;
    }

    next();
  });
}
