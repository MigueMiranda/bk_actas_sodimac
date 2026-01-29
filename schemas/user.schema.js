const Joi = require("joi");

const id = Joi.number().integer();
const name = Joi.string();
const password = Joi.string().min(8);
const cargo = Joi.string().min(5);
const state = Joi.string();
const compañia = Joi.string();
const username = Joi.string();

const createUserSchema = Joi.object({
  id: id.required(),
  name: name.required(),
  password: password,
  cargo: cargo.required(),
  state: state.required(),
  compañia: compañia.required(),
  username: username.required()
});

const getUserSchema = Joi.object({
  id: id.required(),
});

const deleteUserSchema = Joi.object({
  id: id.required(),
});

module.exports = {
  createUserSchema,  
  getUserSchema,
  deleteUserSchema,
};
