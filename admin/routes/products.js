const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../../models/product');
const ProductDetail = require('../../models/productDetail');
const Category = require('../../models/category');

// Cấu hình multer để lưu trữ ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên duy nhất cho ảnh
    }
});

const upload = multer({ storage });

// Lấy tất cả sản phẩm và chi tiết của chúng
router.get('/list', async (req, res) => {
    try {
        const products = await Product.find();
        const productDetails = await ProductDetail.find().populate('productId');
        res.render('product/list', { products, productDetails }); // Render file list.ejs và truyền dữ liệu users vào
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/details/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const productDetail = await ProductDetail.findOne({ productId: req.params.id });
        if (!product || !productDetail) return res.status(404).send('Product not found');
        res.render('product/details', { product, productDetail });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


router.get('/create', async (req, res) => {
    try {
        const categories = await Category.find(); // Lấy tất cả danh mục từ cơ sở dữ liệu
        res.render('product/create', { categories }); // Render file create.ejs và truyền danh sách danh mục vào
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// Thêm sản phẩm mới
router.post('/create', upload.single('image'), async (req, res) => {
    const { name, price, category, brand, description, specifications } = req.body;
    const imageUrl = req.file ? `uploads/${req.file.filename}` : null; // Lấy đường dẫn của ảnh

    try {
        const products = new Product({ name, price, category, brand, imageUrl });
        await products.save();

        const productDetail = new ProductDetail({
            productId: products._id,
            description,
            specifications
        });
        await productDetail.save();

        res.redirect('/products/list')
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Cập nhật thông tin sản phẩm
router.get('/edit/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        
        // Lấy chi tiết sản phẩm và loại danh mục
        const categories = await Category.find();
        const productDetail = await ProductDetail.findOne({ productId: req.params.id });

        res.render('product/edit', { product, productDetail, categories  });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


router.post('/edit/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, price, category, brand, description, specifications } = req.body;
    let imageUrl = req.file ? `uploads/${req.file.filename}` : undefined; // Đảm bảo đường

    try {
        const updateData = { name, price, category, brand };
        if (imageUrl) updateData.imageUrl = imageUrl; // Cập nhật ảnh nếu có

        // Cập nhật sản phẩm
        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Cập nhật chi tiết sản phẩm
        const productDetail = await ProductDetail.findOneAndUpdate(
            { productId: id },
            { description, specifications },
            { new: true, runValidators: true }
        );

        res.redirect('/products/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Xóa thông tin sản phẩm
router.get('/delete/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('User not found');
        res.render('product/delete', { product });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Xóa chi tiết sản phẩm
        await ProductDetail.deleteMany({ productId: id });

        // Xóa sản phẩm
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.redirect('/products/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
