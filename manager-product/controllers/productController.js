const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../utils/dynamodb-helper");
const { uploadToS3, deleteFromS3 } = require("../utils/s3-helper");

/**
 * GET - Display all products
 */
exports.getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.render("products/list", { products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).render("error", {
      message: "Error fetching products. Please try again.",
    });
  }
};

/**
 * GET - Show add product form
 */
exports.showAddForm = (req, res) => {
  res.render("products/add");
};

/**
 * POST - Create new product
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;

    // Validation
    if (!name || !price || !quantity) {
      return res.status(400).render("error", {
        message: "Name, price, and quantity are required.",
      });
    }

    // Upload image to S3
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToS3(req.file);
    }

    // Create product in DynamoDB
    const productData = {
      name,
      price,
      quantity,
      url_image: imageUrl,
    };

    const newProduct = await createProduct(productData);
    res.redirect("/");
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).render("error", {
      message: "Error creating product. Please try again.",
    });
  }
};

/**
 * GET - Show edit product form
 */
exports.showEditForm = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);

    if (!product) {
      return res.status(404).render("error", {
        message: "Product not found.",
      });
    }

    res.render("products/edit", { product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).render("error", {
      message: "Error loading product. Please try again.",
    });
  }
};

/**
 * POST - Update product
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity } = req.body;

    // Validation
    if (!name || !price || !quantity) {
      return res.status(400).render("error", {
        message: "Name, price, and quantity are required.",
      });
    }

    // Get current product
    const currentProduct = await getProductById(id);
    if (!currentProduct) {
      return res.status(404).render("error", {
        message: "Product not found.",
      });
    }

    let imageUrl = currentProduct.url_image;

    // If new image is uploaded, replace old one
    if (req.file) {
      // Delete old image from S3
      if (currentProduct.url_image) {
        await deleteFromS3(currentProduct.url_image);
      }
      // Upload new image
      imageUrl = await uploadToS3(req.file);
    }

    // Update product in DynamoDB
    const updateData = {
      name,
      price,
      quantity,
      url_image: imageUrl,
    };

    await updateProduct(id, updateData);
    res.redirect("/");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).render("error", {
      message: "Error updating product. Please try again.",
    });
  }
};

/**
 * POST - Delete product
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Get product to find image URL
    const product = await getProductById(id);
    if (!product) {
      return res.status(404).render("error", {
        message: "Product not found.",
      });
    }

    // Delete image from S3
    if (product.url_image) {
      await deleteFromS3(product.url_image);
    }

    // Delete product from DynamoDB
    await deleteProduct(id);
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).render("error", {
      message: "Error deleting product. Please try again.",
    });
  }
};
