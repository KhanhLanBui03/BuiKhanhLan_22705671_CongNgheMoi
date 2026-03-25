require('dotenv').config();
const { DynamoDBClient, CreateTableCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    ...(process.env.AWS_SESSION_TOKEN && { sessionToken: process.env.AWS_SESSION_TOKEN }),
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'Products';

async function initTable() {
  try {
    const { TableNames } = await client.send(new ListTablesCommand({}));
    if (TableNames.includes(TABLE_NAME)) {
      console.log(`✅ Table "${TABLE_NAME}" already exists.`);
      return;
    }

    await client.send(new CreateTableCommand({
      TableName: TABLE_NAME,
      AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
      KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
      BillingMode: 'PAY_PER_REQUEST',
    }));
    console.log(`✅ Table "${TABLE_NAME}" created successfully.`);
  } catch (err) {
    console.error('❌ Error initializing table:', err.message);
  }
}

module.exports = { docClient, TABLE_NAME, initTable };
