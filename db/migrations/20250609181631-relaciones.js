'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // -----------------------
    // Relaciones para ELEMENTOS
    // -----------------------

    // // Elemento.userId → users.id
    // await queryInterface.addConstraint('elementos', {
    //   fields: ['user_id'],
    //   type: 'foreign key',
    //   name: 'fk_elementos_user_id',
    //   references: {
    //     table: 'users',
    //     field: 'id'
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'SET NULL'
    // });

    // // Elemento.tiendaId → tiendas.id
    // await queryInterface.addConstraint('elementos', {
    //   fields: ['tienda_id'],
    //   type: 'foreign key',
    //   name: 'fk_elementos_tienda_id',
    //   references: {
    //     table: 'tienda',
    //     field: 'id'
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'SET NULL'
    // });

    // -----------------------
    // Relaciones para MOVIMIENTOS
    // -----------------------

    // Movimiento.serial → elementos.serial
    await queryInterface.addConstraint('movimientos', {
      fields: ['serial'],
      type: 'foreign key',
      name: 'fk_movimientos_serial',
      references: {
        table: 'elementos',
        field: 'serial'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    // Movimiento.contacto_id → users.id
    await queryInterface.addConstraint('movimientos', {
      fields: ['contacto_id'],
      type: 'foreign key',
      name: 'fk_movimientos_contacto_id',
      references: {
        table: 'users',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // -----------------------
    // Quitar relaciones de MOVIMIENTOS
    // -----------------------
    await queryInterface.removeConstraint('movimientos', 'fk_movimientos_serial');
    await queryInterface.removeConstraint('movimientos', 'fk_movimientos_contacto_id');

    // -----------------------
    // Quitar relaciones de ELEMENTOS
    // -----------------------
    await queryInterface.removeConstraint('elementos', 'fk_elementos_user_id');
    await queryInterface.removeConstraint('elementos', 'fk_elementos_tienda_id');
  }
};