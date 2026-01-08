const express = require('express');
const router = express.Router();

const MovimientosService = require('./../services/movimientos.service');
const service = new MovimientosService();

router.get('/', 
  async (req, res, next) => {
  try {
    const movimientos = await service.getAll();
    res.json(movimientos);
  } catch (error) {
    next(error);
  }
});

module.exports = router;