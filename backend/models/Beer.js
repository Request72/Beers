const mongoose = require('mongoose');

const beerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brewery: {
      type: String,
      required: true,
    },
    style: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    abv: {
      type: Number,
      required: true,
      min: 0,
      max: 15,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Beer', beerSchema);
