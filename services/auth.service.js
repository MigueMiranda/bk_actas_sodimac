const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { config } = require('../config/config');

const UserService = require('./users.service');
const service = new UserService

class AuthService {

  async getUser(username, password, cargo) {
    const user = await service.findByUsername(username);
    if (!user) {
      throw boom.unauthorized();
    }
    if (user.password !== password || user.cargo !== cargo) {
      throw boom.unauthorized('Credenciales incorrectas');
    }
    delete user.dataValues.password;
    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      username: user.username,
      cargo: user.cargo
    }
    const token = jwt.sign(payload, config.jwtSecret);
    return {
      user,
      token
    }
  }
}

module.exports = AuthService;
