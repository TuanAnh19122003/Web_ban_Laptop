const express = require('express');
const router = express.Router();
const Category = require('../models/category');

// Thêm loại sản phẩm mới với ID tùy chỉnh
router.post('/', async (req, res) => {
    const { id, name, description } = req.body; // Nhận ID từ request body

    const category = new Category({ _id: id, name, description });

    try {
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Lấy tất cả các loại sản phẩm
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy thông tin loại sản phẩm theo ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findById(id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Cập nhật thông tin loại sản phẩm
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const category = await Category.findByIdAndUpdate(
            id,
            { name, description },
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        if (!category) return res.status(404).json({ message: 'Category not found' });

        res.json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Xóa loại sản phẩm
router.delete('/:id', async (req, res) => {
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
