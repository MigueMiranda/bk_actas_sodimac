const express = require('express');
const router = express.Router();

const ElementosService = require('./../services/elementos.service');
const service = new ElementosService();

router.get('/', async (req, res, next) => {
  try {
    res.set('Cache-Control', 'no-store');
    const elements = await service.find();
    res.json(elements);
  } catch (error) {
    next(error);
  }
});


module.exports = router;