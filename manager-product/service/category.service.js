

const { GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamoDBDocClient } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const tableName = process.env.AWS_DYNAMODB_TABLE_NAME || "Category";

async function getAllCategories() {
    const params = {
        TableName: tableName,
    };
    try {
        const response = await dynamoDBDocClient.send(new ScanCommand(params));
        return response.Items || [];
    } catch (error) {
        console.error("Error scanning DynamoDB:", error);
        throw error;
    }
}

async function getCategoryById(id) {
    const params = {
        TableName: tableName,
        Key: { id }
    };
    try {
        const response = await dynamoDBDocClient.send(new GetCommand(params))
    } catch (error) {
        console.error("Error scanning DynamoDB:", error);
        throw error;
    }
}

async function createCategory(categoryData) {
    const category = {
        id: uuidv4(),
        name: categoryData.name,
        description: categoryData.description
    };

    const params = {
        TableName: tableName,
        Item: category,
    };
    try {
        await dynamoDBDocClient.send(new PutCommand(params));
        return category;
    } catch (error) {
        console.error("Error creating product in DynamoDB:", error);
        throw error;
    }
}
async function deleteCategory(id) {
  const params = {
    TableName: tableName,
    Key: { id },
  };

  try {
    await dynamoDBDocClient.send(new DeleteCommand(params));
  } catch (error) {
    console.error("Error deleting product from DynamoDB:", error);
    throw error;
  }
}

module.exports = {
    deleteCategory,createCategory,getAllCategories,getCategoryById
}

