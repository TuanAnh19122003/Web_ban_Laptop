const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const ProductDetail = require('../models/productDetail');

// Lấy tất cả sản phẩm và chi tiết của chúng
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        const productDetails = await ProductDetail.find().populate('productId');
        res.json({ products, productDetails });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Thêm sản phẩm mới
router.post('/', async (req, res) => {
    const { name, price, category, brand, imageUrl, description, specifications } = req.body;
    try {
        const product = new Product({ name, price, category, brand, imageUrl });
        await product.save();

        const productDetail = new ProductDetail({
            productId: product._id,
            description,
            specifications
        });
        await productDetail.save();

        res.status(201).json({ product, productDetail });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Cập nhật thông tin sản phẩm
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, category, brand, imageUrl, description, specifications } = req.body;
    try {
        // Cập nhật sản phẩm
        const product = await Product.findByIdAndUpdate(
            id,
            { name, price, category, brand, imageUrl },
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Cập nhật chi tiết sản phẩm
        const productDetail = await ProductDetail.findOneAndUpdate(
            { productId: id },
            { description, specifications },
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        res.json({ product, productDetail });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Xóa thông tin sản phẩm
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Xóa chi tiết sản phẩm
        await ProductDetail.deleteMany({ productId: id });

        // Xóa sản phẩm
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
