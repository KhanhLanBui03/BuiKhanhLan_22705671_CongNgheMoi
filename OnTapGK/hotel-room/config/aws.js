const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const { S3Client } = require("@aws-sdk/client-s3")
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb")


const info = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
}
const docClient = DynamoDBDocumentClient.from(new DynamoDBClient(info))
const s3Client = new S3Client(info)

module.exports = {
    docClient,
    s3Client
}