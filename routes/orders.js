const express = require('express');
const router = express.Router();
const Order = require('../models/orders');
const Product = require('../models/product'); // Import model Product để kiểm tra sản phẩm tồn tại

// Lấy tất cả đơn hàng
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('userId').populate('products.productId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Thêm đơn hàng mới
router.post('/', async (req, res) => {
    const { userId, products, totalAmount, status } = req.body;

    // Kiểm tra xem tất cả sản phẩm có tồn tại không
    for (const item of products) {
        const product = await Product.findById(item.productId);
        if (!product) return res.status(400).json({ message: `Product with ID ${item.productId} not found` });
    }

    try {
        const order = new Order({ userId, products, totalAmount, status });
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Cập nhật thông tin đơn hàng
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { userId, products, totalAmount, status } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(
            id,
            { userId, products, totalAmount, status },
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Xóa đơn hàng
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const order = await Order.findByIdAndDelete(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
