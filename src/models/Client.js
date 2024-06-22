const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const clientSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
  },
  name: {
    type: String,
    required: true,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255,
    match: [/.+\@.+\..+/],
  },
  phone: {
    type: String,
    required: true,
    maxlength: 20,
    match: /^[0-9]{10,20}$/,
  },
  address: {
    cep: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      maxlength: 255,
    },
    neighborhood: {
      type: String,
      maxlength: 255,
    },
    city: {
      type: String,
      maxlength: 255,
    },
    state: {
      type: String,
      maxlength: 2,
    },
  },
});

module.exports = mongoose.model('Client', clientSchema);
