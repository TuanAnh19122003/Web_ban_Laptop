const mongoose = require('mongoose');

const productDetailSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    description: { type: String },
    specifications: { type: String },
    warranty: { type: String }
});


module.exports = mongoose.model('ProductDetail', productDetailSchema);
