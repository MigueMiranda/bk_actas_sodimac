const boom = require("@hapi/boom");

const { models } = require("../libs/sequelize");

class MovimientosService {
  constructor() {}

  async getAll() {
    const rta = await models.Movimiento.findAll();
    return rta;
  }
}

module.exports = MovimientosService;
