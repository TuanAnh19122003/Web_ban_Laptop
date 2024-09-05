const express = require('express');
const path = require('path'); // Import thêm path để lấy đường dẫn tới file HTML
const User = require('../models/user'); // Import mô hình User
const router = express.Router();

// Hiển thị trang đăng nhập
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// Xử lý đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const em = await User.findOne({ email });

        if (!em) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // So sánh mật khẩu trực tiếp mà không mã hóa
        if (em.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Nếu thông tin đăng nhập hợp lệ
        res.redirect('/users/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Hiển thị trang đăng ký
router.get('/register', (req, res) => {
    res.render('auth/register'); // Render file register.ejs
});

// Xử lý đăng ký
router.post('/register', async (req, res) => {
    const { name ,email, password, address } = req.body;

    try {
        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Tạo người dùng mới
        const user = new User({ name, email, password, address });
        await user.save();
        res.redirect('/auth/login');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
