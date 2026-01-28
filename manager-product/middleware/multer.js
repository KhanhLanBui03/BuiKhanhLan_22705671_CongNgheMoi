const multer = require("multer");

// Configure multer for memory storage (will be uploaded to S3)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept image files only
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

module.exports = upload;
