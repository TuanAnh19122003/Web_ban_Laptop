const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true, unique: true, trim: true },
});

module.exports = mongoose.model('Category', categorySchema);
