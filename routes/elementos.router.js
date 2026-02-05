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

router.get('/:campo/:valor',
  async (req, res, next) => {
    try {
      const { campo, valor } = req.params;
      if (!['serial', 'placa'].includes(campo)) {
        return res.status(400).json({ message: "Campo no válido" });
      }
      const element = await service.findByCampo(campo, valor);
      res.json(element);
    } catch (error) {
      next(error);
    }
  }
);


module.exports = router;