const { User, UserSchema } = require('./users.model');
const { Elemento, ElementoSchema } = require('./elementos.model');
const { TiendaSchema, Tienda } = require('./tiendas.model');
const { MovimientoSchema, Movimiento } = require('./movimientos.model');
const { AsignacionesSchema, Asignaciones } = require('./asignaciones.model');


function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Elemento.init(ElementoSchema, Elemento.config(sequelize));
  Tienda.init(TiendaSchema, Tienda.config(sequelize));
  Movimiento.init(MovimientoSchema, Movimiento.config(sequelize));
  Asignaciones.init(AsignacionesSchema, Asignaciones.config(sequelize));

  User.associate(sequelize.models);
  Elemento.associate(sequelize.models);
  Tienda.associate(sequelize.models);
  Movimiento.associate(sequelize.models);
  Asignaciones.associate(sequelize.models);
}

module.exports = setupModels;