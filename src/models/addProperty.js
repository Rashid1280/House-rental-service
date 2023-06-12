const mongoose = require('mongoose');

// Define Property Schema
const propertySchema = new mongoose.Schema({
  propertyType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  ownerNo: {
    type: Number,
    required: true
  },
  images: [{ type: String }] 
});

var propertyModel = mongoose.model('property', propertySchema);
module.exports = propertyModel;