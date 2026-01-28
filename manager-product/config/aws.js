require('dotenv').config(); // PHẢI CÓ DÒNG NÀY Ở ĐẦU FILE
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { S3Client } = require("@aws-sdk/client-s3");

const awsConfig = {
  region: process.env.AWS_REGION || "ap-southeast-2",
};

// Chỉ thêm credentials nếu chạy ở Local (có biến trong .env)
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  awsConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
  console.log("Sử dụng AWS Credentials từ file .env");
} else {
  console.log("Sử dụng IAM Role (chế độ Production)");
}

const dynamoDBClient = new DynamoDBClient(awsConfig);
const s3Client = new S3Client(awsConfig);

module.exports = { dynamoDBClient, s3Client };