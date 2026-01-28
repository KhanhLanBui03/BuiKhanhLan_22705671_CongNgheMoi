const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
// Đảm bảo đường dẫn này trỏ đúng vào file ở Bước 1
const { dynamoDBClient } = require("./aws");

const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamoDBClient, {
  marshallOptions: { removeUndefinedValues: true },
});

module.exports = { dynamoDBDocClient };