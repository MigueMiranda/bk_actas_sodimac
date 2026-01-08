const boom = require("@hapi/boom");

const { models } = require("../libs/sequelize");

class ElementosService {
  constructor() {}

  async create(data) {
    const newElemento = await models.Elemento.create(data);
    return newElemento;
  }

  async find() {
    const rta = await models.Elemento.findAll({
      include: [
        "tienda",
        {
          association: "usuario",
          attributes: ["id", "name", "username", "cargo"],
        },
      ],
    });
    return rta;
  }

  async findOne(id) {
    const elemento = await models.Elemento.findByPk(id);
    if (!elemento) {
      throw boom.notFound("Elemento not found");
    }
    return elemento;
  }

  async update(id, changes) {
    const elemento = await this.findOne(id);
    await elemento.update(changes);
    return elemento;
  }
}

module.exports = ElementosService;
