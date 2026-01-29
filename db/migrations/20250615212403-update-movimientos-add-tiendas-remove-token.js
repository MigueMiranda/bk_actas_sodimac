"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("movimientos");

    // Eliminar token solo si existe
    if (table.token) {
      await queryInterface.removeColumn("movimientos", "token");
    }

    // Agregar tienda_id solo si no existe
    if (!table.tienda_id) {
      await queryInterface.addColumn("movimientos", "tienda_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("movimientos");

    if (!table.token) {
      await queryInterface.addColumn("movimientos", "token", {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      });
    }

    if (table.tienda_id) {
      await queryInterface.removeColumn("movimientos", "tienda_id");
    }
  },
};
