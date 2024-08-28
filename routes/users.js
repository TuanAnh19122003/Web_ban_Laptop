const express = require('express');
const router = express.Router();
const User = require('../models/user');


// Lấy tất cả sản phẩm và chi tiết của chúng
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Thêm sản phẩm mới
router.post('/', async (req, res) => {
    const { name, email, password, address } = req.body;
    try {
        const users = new User({ name, email, password, address });
        await users.save();
        res.status(201).json({ users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Cập nhật thông tin sản phẩm
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password, address } = req.body;
    try {
        // Cập nhật sản phẩm
        const users = await User.findByIdAndUpdate(
            id,
            { name, email, password, address },
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        if (!users) return res.status(404).json({ message: 'Product not found' });
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Xóa thông tin sản phẩm
router.delete('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        await item.remove();
        res.json({ message: 'Deleted Item' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
