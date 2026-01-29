"use strict";

const {
  ASIGNACIONES_TABLE,
  AsignacionesSchema,
} = require("../models/asignaciones.model");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(ASIGNACIONES_TABLE, AsignacionesSchema);
    // await queryInterface.addColumn("movimientos", "asignacion_id", {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    //   references: {
    //     model: ASIGNACIONES_TABLE,
    //     key: "id",
    //   },
    //   onUpdate: "CASCADE",
    //   onDelete: "SET NULL",
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("movimientos", "asignacion_id");
    await queryInterface.dropTable(ASIGNACIONES_TABLE);
  },
};
