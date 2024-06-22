const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  cep: {
    type: String,
    required: true,
    match: /^[0-9]{8}$/,
  },
  state: {
    type: String,
    required: true,
    match: /^[A-Z]{2}$/,
  },
  city: {
    type: String,
    required: true,
    maxlength: 255,
  },
  neighborhood: {
    type: String,
    maxlength: 255,
  },
  street: {
    type: String,
    maxlength: 255,
  },
});

module.exports = mongoose.model('Address', addressSchema);
