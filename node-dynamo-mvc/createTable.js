
const AWS = require("aws-sdk");
require("dotenv").config();

const dynamodb = new AWS.DynamoDB({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const params = {
  TableName: "Products",
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" }
  ],
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "S" },
  ],
  BillingMode: "PAY_PER_REQUEST",
};

dynamodb.createTable(params, (err, data) => {
  if (err) console.log("Error", err);
  else console.log("Table Created", data);
});
