const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

const ProductController = {
  // GET / - List all products
  async index(req, res) {
    try {
      const search = req.query.search || '';
      const products = await Product.getAll(search);
      res.render('products/index', {
        products,
        search,
        message: req.query.message || null,
        error: req.query.error || null,
      });
    } catch (err) {
      res.render('products/index', {
        products: [],
        search: '',
        message: null,
        error: 'Không thể tải danh sách sản phẩm: ' + err.message,
      });
    }
  },

  // GET /products/create
  create(req, res) {
    res.render('products/create', { errors: [], old: {} });
  },

  // POST /products
  async store(req, res) {
    const { name, price, unit_in_stock } = req.body;
    const errors = [];

    if (!name || name.trim() === '') errors.push('Tên sản phẩm không được để trống.');
    if (!price || isNaN(price) || parseFloat(price) < 0) errors.push('Giá phải là số không âm.');
    if (!unit_in_stock || isNaN(unit_in_stock) || parseInt(unit_in_stock) < 0) errors.push('Số lượng tồn kho phải là số không âm.');

    if (errors.length > 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.render('products/create', { errors, old: req.body });
    }

    try {
      const url_image = req.file ? '/uploads/' + req.file.filename : '';
      await Product.create({ name: name.trim(), price, unit_in_stock, url_image });
      res.redirect('/?message=Thêm sản phẩm thành công!');
    } catch (err) {
      if (req.file) fs.unlinkSync(req.file.path);
      res.render('products/create', {
        errors: ['Lỗi khi thêm sản phẩm: ' + err.message],
        old: req.body,
      });
    }
  },

  // GET /products/:id
  async show(req, res) {
    try {
      const product = await Product.getById(req.params.id);
      if (!product) return res.redirect('/?error=Không tìm thấy sản phẩm.');
      res.render('products/show', { product });
    } catch (err) {
      res.redirect('/?error=' + err.message);
    }
  },

  // GET /products/:id/edit
  async edit(req, res) {
    try {
      const product = await Product.getById(req.params.id);
      if (!product) return res.redirect('/?error=Không tìm thấy sản phẩm.');
      res.render('products/edit', { product, errors: [] });
    } catch (err) {
      res.redirect('/?error=' + err.message);
    }
  },

  // PUT /products/:id
  async update(req, res) {
    const { name, price, unit_in_stock, keep_image } = req.body;
    const errors = [];

    if (!name || name.trim() === '') errors.push('Tên sản phẩm không được để trống.');
    if (!price || isNaN(price) || parseFloat(price) < 0) errors.push('Giá phải là số không âm.');
    if (!unit_in_stock || isNaN(unit_in_stock) || parseInt(unit_in_stock) < 0) errors.push('Số lượng tồn kho phải là số không âm.');

    if (errors.length > 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      try {
        const product = await Product.getById(req.params.id);
        return res.render('products/edit', { product, errors });
      } catch {
        return res.redirect('/?error=Lỗi tải sản phẩm.');
      }
    }

    try {
      const existing = await Product.getById(req.params.id);
      let url_image = existing.url_image;

      if (req.file) {
        // Delete old image if exists
        if (existing.url_image) {
          const oldPath = path.join(__dirname, '../public', existing.url_image);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        url_image = '/uploads/' + req.file.filename;
      }

      await Product.update(req.params.id, { name: name.trim(), price, unit_in_stock, url_image });
      res.redirect('/?message=Cập nhật sản phẩm thành công!');
    } catch (err) {
      if (req.file) fs.unlinkSync(req.file.path);
      res.redirect('/?error=Lỗi cập nhật: ' + err.message);
    }
  },

  // DELETE /products/:id
  async destroy(req, res) {
    try {
      const product = await Product.getById(req.params.id);
      if (product && product.url_image) {
        const imgPath = path.join(__dirname, '../public', product.url_image);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }
      await Product.delete(req.params.id);
      res.redirect('/?message=Xóa sản phẩm thành công!');
    } catch (err) {
      res.redirect('/?error=Lỗi xóa: ' + err.message);
    }
  },
};

module.exports = ProductController;
