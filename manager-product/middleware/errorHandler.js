/**
 * Error handling middleware
 */
function errorHandler(err, req, res, next) {
  console.error("Error:", err);

  // Handle multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).render("error", {
      message: "File size too large. Maximum size is 5MB.",
    });
  }

  if (err.message === "Only image files are allowed") {
    return res.status(400).render("error", {
      message: "Only image files are allowed (JPEG, PNG, GIF, WebP).",
    });
  }

  // Handle AWS errors
  if (err.name === "ValidationException") {
    return res.status(400).render("error", {
      message: "Invalid request data.",
    });
  }

  // Default error response
  res.status(500).render("error", {
    message: "An error occurred. Please try again later.",
  });
}

module.exports = errorHandler;
