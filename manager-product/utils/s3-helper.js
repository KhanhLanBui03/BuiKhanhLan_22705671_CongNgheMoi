const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/aws");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

/**
 * Upload file to S3
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} - S3 URL of uploaded file
 */
async function uploadToS3(file) {
  if (!file) return null;

  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const fileName = `products/${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read", // Make file publicly readable
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || "ap-southeast-1"}.amazonaws.com/${fileName}`;
    return fileUrl;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
}

async function deleteFromS3(fileUrl) {
  if (!fileUrl) return;

  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    // Extract key from URL
    const fileKey = fileUrl.split(`${bucketName}.s3.${process.env.AWS_REGION || "ap-southeast-1"}.amazonaws.com/`)[1];

    if (!fileKey) {
      console.error("Invalid S3 URL format:", fileUrl);
      return;
    }

    const params = {
      Bucket: bucketName,
      Key: fileKey,
    };

    await s3Client.send(new DeleteObjectCommand(params));
    console.log(`File deleted from S3: ${fileKey}`);
  } catch (error) {
    console.error("Error deleting from S3:", error);
    // Don't throw - let the operation continue
  }
}

module.exports = {
  uploadToS3,
  deleteFromS3,
};
