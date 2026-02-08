const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.static(__dirname + "/public"));

app.use("/products", productRoutes);

app.get("/", (req, res) => res.redirect("/products"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
