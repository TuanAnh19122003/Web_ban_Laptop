const express = require('express');
const path = require('path'); // Import thêm path để lấy đường dẫn tới file HTML
const User = require('../models/user'); // Import mô hình User
const router = express.Router();

// Hiển thị trang đăng nhập
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html')); // Gửi file HTML tới trình duyệt
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
        res.json({ message: 'Login successful', em });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
