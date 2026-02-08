const Product = require("../models/productModel");

exports.getAllProducts = async (req, res) => {
  const products = await Product.getAll();
  res.render("products/index", { products });
};

exports.showCreateForm = (req, res) => {
  res.render("products/create");
};

exports.createProduct = async (req, res) => {
  await Product.create(req.body);
  res.redirect("/products");
};

exports.showEditForm = async (req, res) => {
  const product = await Product.getById(req.params.id);
  res.render("products/edit", { product });
};

exports.updateProduct = async (req, res) => {
  await Product.update(req.params.id, req.body);
  res.redirect("/products");
};

exports.deleteProduct = async (req, res) => {
  await Product.delete(req.params.id);
  res.redirect("/products");
};
