const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.getAllProducts);
router.get("/create", productController.showCreateForm);
router.get("/edit/:id", productController.showEditForm);

router.post("/create", productController.createProduct);
router.post("/edit/:id", productController.updateProduct);
router.post("/delete/:id", productController.deleteProduct);

module.exports = router;
