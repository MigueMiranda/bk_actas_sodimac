const express = require('express');

const usersRouter = require('./users.router');
const authRouter = require('./auth.router');
const tiendasRouter = require('./tiendas.router');
const elementosRouter = require('./elementos.router');
const asignacionRouter = require('./asignacion.router');
const movimientosRouter = require('./movimientos.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/users', usersRouter);
    router.use('/auth', authRouter);
    router.use('/tiendas', tiendasRouter);
    router.use('/elementos', elementosRouter);
    router.use('/asignacion', asignacionRouter);
    router.use('/movimientos', movimientosRouter);
}

module.exports = routerApi;