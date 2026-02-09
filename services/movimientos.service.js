const boom = require("@hapi/boom");

const { models } = require("../libs/sequelize");

class MovimientosService {
  constructor() { }

  async getAll() {
    const rta = await models.Movimiento.findAll({
      include: [
        {
          model: models.User,
          as: "users",
          attributes: ["id", "name"]
        },
        {
          model: models.Elemento,
          as: "elemento",
          include: [
            {
              model: models.Tienda,
              as: "tienda",
              attributes: ["id", "nombre"]
            }
          ]
        },
        {
          model: models.Asignaciones,
          as: "asignacion",
          attributes: ["id", "estado_asignacion", "token", "created_at"]
        }
      ],
      order: [["id", "DESC"]]
    });
    return rta;
  }
}

module.exports = MovimientosService;
