const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const formSchema = new Schema({
  text: String,
  title: String,
  order: Number,
  image: String
});

module.exports = mongoose.model('Item', formSchema);
