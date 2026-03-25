const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { S3Client } = require("@aws-sdk/client-s3");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const client = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
};


const s3Client = new S3Client(client);
const docClient = DynamoDBDocumentClient.from(new DynamoDBClient(client));

module.exports = {
    s3Client,
    docClient
};
