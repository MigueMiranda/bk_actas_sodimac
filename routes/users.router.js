const express = require('express');
const router = express.Router();
const validatorHandler = require('../middlewares/validator.handler');
const { getUserSchema  } = require('../schemas/user.schema');


const UserService = require('./../services/users.service');
const service = new UserService();

router.get('/',
  async (req, res, next) => {
  try {
    const users = await service.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const users = await service.findOne(id);
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/', (req, res) => {
  res.json({ message: 'Usuario creado', data: req.body });
});

module.exports = router;