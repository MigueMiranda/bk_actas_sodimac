"use strict";

const { USER_TABLE } = require("../models/users.model");
const { TIENDAS_TABLE } = require("../models/tiendas.model");
const { ELEMENTOS_TABLE } = require("../models/elementos.model");
const { MOVIMIENTO_TABLE } = require("../models/movimientos.model");
const { ASIGNACIONES_TABLE } = require("../models/asignaciones.model");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // -----------------------
    // Relaciones ELEMENTOS
    // -----------------------

    // elementos.user_id → users.id
    await queryInterface.addConstraint(ELEMENTOS_TABLE, {
      fields: ["user_id"],
      type: "foreign key",
      name: "fk_elementos_user_id",
      references: {
        table: USER_TABLE,
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    // elementos.tienda_id → tiendas.id
    await queryInterface.addConstraint(ELEMENTOS_TABLE, {
      fields: ["tienda_id"],
      type: "foreign key",
      name: "fk_elementos_tienda_id",
      references: {
        table: TIENDAS_TABLE,
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    // -----------------------
    // Relaciones MOVIMIENTOS
    // -----------------------

    // movimientos.serial → elementos.serial
    await queryInterface.addConstraint(MOVIMIENTO_TABLE, {
      fields: ["serial"],
      type: "foreign key",
      name: "fk_movimientos_serial",
      references: {
        table: ELEMENTOS_TABLE,
        field: "serial",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });

    // movimientos.contacto_id → users.id
    await queryInterface.addConstraint(MOVIMIENTO_TABLE, {
      fields: ["contacto_id"],
      type: "foreign key",
      name: "fk_movimientos_contacto_id",
      references: {
        table: USER_TABLE,
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    });

    await queryInterface.addConstraint(ASIGNACIONES_TABLE, {
      fields: ["contacto_id"],
      type: "foreign key",
      name: "fk_asignaciones_contacto_id",
      references: {
        table: USER_TABLE,
        field: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface) {
    // MOVIMIENTOS
    await queryInterface.removeConstraint(
      MOVIMIENTO_TABLE,
      "fk_movimientos_serial",
    );
    await queryInterface.removeConstraint(
      MOVIMIENTO_TABLE,
      "fk_movimientos_contacto_id",
    );

    // ELEMENTOS
    await queryInterface.removeConstraint(
      ELEMENTOS_TABLE,
      "fk_elementos_user_id",
    );
    await queryInterface.removeConstraint(
      ELEMENTOS_TABLE,
      "fk_elementos_tienda_id",
    );
  },
};
