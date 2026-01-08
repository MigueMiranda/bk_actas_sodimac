const boom = require('@hapi/boom');

const { config } = require('../config/config');

function checkApiKey(req, res, next) {
  const apiKey = req.headers['api'];
  if (apiKey === config.apiKey) {
    next();
  } else {
    next(boom.unauthorized('Invalid'));
  }
}

function checkAdminRole(req, res, next) {
  const user = req.user;
  if (user.cargo === 'admin') {
    next();
  } else {
    next(boom.unauthorized('Invalid'));
  }
}

function checkRoles(...roles) {
  return (req, res, next) => {
    const user = req.user;
    if (roles.includes(user.cargo)) {
      next();
    } else {
      next(boom.unauthorized('Invalid'));
    }
  };
}

module.exports = { checkApiKey, checkAdminRole, checkRoles };