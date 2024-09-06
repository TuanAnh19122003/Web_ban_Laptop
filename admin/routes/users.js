const express = require('express');
const router = express.Router();
const User = require('../../models/user');


// Lấy tất cả sản phẩm và chi tiết của chúng
router.get('/list', async (req, res) => {
    try {
        const users = await User.find();
        res.render('user/list', { users }); // Render file list.ejs và truyền dữ liệu users vào
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route để hiện chi tiết người dùng
router.get('/details/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        res.render('users/details', { user });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Hiển thị form tạo người dùng mới
router.get('/create', (req, res) => {
    res.render('user/create'); // Render file create.ejs
});

// Thêm người dùng mới
router.post('/create', async (req, res) => {
    const { name, email, password, address } = req.body;
    try {
        const user = new User({ name, email, password, address });
        await user.save();
        res.redirect('/users/list'); // Chuyển hướng về danh sách người dùng sau khi tạo thành công
    } catch (err) {
        res.status(500).render('error', { message: err.message }); // Render trang lỗi nếu có lỗi
    }
});


// Hiển thị form chỉnh sửa người dùng
router.get('/edit/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.render('user/edit', { user });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route để cập nhật thông tin người dùng
router.post('/edit/:id', async (req, res) => {
    const { name, email, password, address } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, password, address },
            { new: true, runValidators: true }
        );
        if (!user) return res.status(404).send('User not found');
        res.redirect('/users/list');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/delete/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.render('user/delete', { user });
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// Xóa người dùng
router.post('/delete/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.redirect('/users/list'); // Redirect đến trang danh sách người dùng
    } catch (err) {
        res.status(500).send(err.message);
    }
});



module.exports = router;
