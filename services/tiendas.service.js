const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');

class tiendasService {
  constructor() {
  }

  async create(data) {
    const newTienda = await models.Tienda.create(data);
    return newTienda;
  }

  async find() {
    const rta = await models.Tienda.findAll();
    return rta;
  }

  async findOne(id) {
    const tienda = await models.Tienda.findByPk(id);
    if (!tienda) {
      throw boom.notFound('Tienda not found');
    }
    return tienda;
  }

  async update(id, changes) {
    const tienda = await this.findOne(id);
    await tienda.update(changes);
    return tienda;
  }

  async delete(id) {
    const tienda = await this.findOne(id);
    await models.Tienda.destroy({
      where: { id: tienda.id }
    });
    return { id };
  }
}

module.exports = tiendasService;