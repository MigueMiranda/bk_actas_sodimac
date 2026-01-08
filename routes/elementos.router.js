const express = require('express');
const router = express.Router();

const ElementosService = require('./../services/elementos.service');
const service = new ElementosService();

router.get('/', 
  async (req, res, next) => {
  try {
    const elemnts = await service.find();
    res.json(elemnts);
  } catch (error) {
    next(error);
  }
});

router.post('/', (req, res) => {
  res.json({ message: 'Usuario creado', data: req.body });
});

module.exports = router;