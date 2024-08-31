const express = require('express');
const path = require('path');
const Category = require('../models/category');
const router = express.Router();

// Hiển thị trang quản lý loại sản phẩm
// Route để gửi tệp HTML
router.get('/manage', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/manage_categories.html'));
});

// Route API để lấy danh sách loại sản phẩm
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
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
