const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middleware/multer");

// GET - List all products
router.get("/", productController.getProducts);

// GET - Show add product form
router.get("/add", productController.showAddForm);

// POST - Create new product
router.post("/add", upload.single("image"), productController.createProduct);

// GET - Show edit product form
router.get("/edit/:id", productController.showEditForm);

// POST - Update product
router.post("/edit/:id", upload.single("image"), productController.updateProduct);

// POST - Delete product
router.post("/delete/:id", productController.deleteProduct);

module.exports = router;
