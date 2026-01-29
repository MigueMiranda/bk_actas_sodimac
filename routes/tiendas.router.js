const express = require('express');
const router = express.Router();

const TiendaService = require('./../services/tiendas.service');
const service = new TiendaService();

router.get('/', 
  async (req, res, next) => {
  try {
    const tienda = await service.find();
    res.json(tienda);
  } catch (error) {
    next(error);
  }
});

router.post('/', (req, res) => {
  res.json({ message: 'Usuario creado', data: req.body });
});

module.exports = router;