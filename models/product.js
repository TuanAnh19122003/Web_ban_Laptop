const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, ref: 'Category', required: true },
    brand: { type: String },
    imageUrl: { type: String }
});


module.exports = mongoose.model('Product', productSchema);