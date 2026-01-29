"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("movimientos");

    // Agregar solo si NO existe
    if (!table.ubicacion_elemento) {
      await queryInterface.addColumn("movimientos", "ubicacion_elemento", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("movimientos");

    // Eliminar solo si existe
    if (table.ubicacion_elemento) {
      await queryInterface.removeColumn("movimientos", "ubicacion_elemento");
    }
  },
};
