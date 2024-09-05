const express = require('express');
const path = require('path');
const Category = require('../models/category');
const router = express.Router();

// Lấy tất cả sản phẩm và chi tiết của chúng
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Thêm loại sản phẩm mới
router.post('/add', async (req, res) => {
    const { id, name } = req.body;

    try {
        const category = new Category({ _id: id, name });
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật loại sản phẩm
router.patch('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const category = await Category.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        if (!category) return res.status(404).json({ message: 'Category not found' });

        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Xóa loại sản phẩm
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByIdAndDelete(id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
