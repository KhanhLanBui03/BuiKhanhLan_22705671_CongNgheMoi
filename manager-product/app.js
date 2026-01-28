require("dotenv").config();
const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const productRoutes = require("./routes/products");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layout");

// Routes
app.use("/", productRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render("error", {
    message: "Page not found. Please check the URL.",
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Product Management App is running on http://localhost:${PORT}`);
  console.log(`📝 Make sure to configure AWS credentials and environment variables in .env file`);
});

module.exports = app;
