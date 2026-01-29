'use strict';

'use strict';

const { USER_TABLE, UserSchema } = require('../models/users.model');
const { TIENDAS_TABLE, TiendaSchema } = require('../models/tiendas.model');
const { ELEMENTOS_TABLE, ElementoSchema } = require('../models/elementos.model');
const { MOVIMIENTO_TABLE, MovimientoSchema } = require('../models/movimientos.model');
const { ASIGNACIONES_TABLE, AsignacionesSchema } = require('../models/asignaciones.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(USER_TABLE, UserSchema);
    await queryInterface.createTable(TIENDAS_TABLE, TiendaSchema);
    await queryInterface.createTable(ASIGNACIONES_TABLE, AsignacionesSchema);
    await queryInterface.createTable(ELEMENTOS_TABLE, ElementoSchema);
    await queryInterface.createTable(MOVIMIENTO_TABLE, MovimientoSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(MOVIMIENTO_TABLE);
    await queryInterface.dropTable(ELEMENTOS_TABLE);
    await queryInterface.dropTable(ASIGNACIONES_TABLE);
    await queryInterface.dropTable(TIENDAS_TABLE);
    await queryInterface.dropTable(USER_TABLE);
  }
};
