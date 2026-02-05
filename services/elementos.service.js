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
    console.log('Elementos:',rta.length);
    return rta;
  }

  async findOne(id) {
    const elemento = await models.Elemento.findByPk(id);
    if (!elemento) {
      throw boom.notFound("Elemento not found");
    }
    return elemento;
  }

  async findByCampo(campo, valor) {
    const elemento = await models.Elemento.findOne({
      where: { [campo]: valor }
    })
    return elemento;
  }

  async update(id, changes) {
    const elemento = await this.findOne(id);
    await elemento.update(changes);
    return elemento;
  }
}

module.exports = ElementosService;
