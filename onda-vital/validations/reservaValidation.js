const Joi = require('joi');

/**
 * Esquema de validación para la creación de una reserva.
 */
const reservaSchema = Joi.object({
  nombre: Joi.string().min(3).required().messages({
    'string.empty': 'el nombre es obligatorio',
    'string.min': 'el nombre debe tener al menos 3 caracteres',
    'any.required': 'el nombre es obligatorio'
  }),
  sala: Joi.string().required().messages({
    'string.empty': 'la sala es obligatoria',
    'any.required': 'la sala es obligatoria'
  }),
  fecha: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().messages({
    'string.pattern.base': 'formato de fecha inválido (YYYY-MM-DD)',
    'any.required': 'la fecha es obligatoria'
  }),
  horario: Joi.string().pattern(/^(\d{1,2}:\d{2})(,\s*\d{1,2}:\d{2})*$/).required().messages({
    'string.pattern.base': 'formato de horario inválido (ej: 10:00, 11:00)',
    'any.required': 'el horario es obligatorio'
  }),
  contacto: Joi.string().allow('', null).optional(),
  estado: Joi.string().valid('pendiente', 'confirmada', 'rechazada').optional()
});

module.exports = {
  reservaSchema
};
