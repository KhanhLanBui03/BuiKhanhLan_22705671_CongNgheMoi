require("dotenv").config();
const express = require("express");
const multer = require("multer");
const app = express();

//middlewares
app.use(express.urlencoded({ extended: true }));
const upload = multer({storage: multer.memoryStorage()});

// views
app.set("view engine", "ejs");
app.set("views", "./views");

const PORT = process.env.PORT || 3000;

const productController = require("./controllers/product-controller");
app.get("/", productController.renderItem);
app.get("/form", productController.renderForm);
app.get("/form/:id", productController.renderForm);
app.post("/products", upload.single("image"), productController.handleUpsert);
app.post(
    "/products/:id",
    upload.single("image"),
    productController.handleUpsert,
);
app.post("/products/delete/:id", productController.deleteItem);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});