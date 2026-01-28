const { GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamoDBDocClient } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const tableName = process.env.AWS_DYNAMODB_TABLE_NAME || "Products";

/**
 * Get all products
 * @returns {Promise<Array>} - Array of products
 */
async function getAllProducts() {
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

/**
 * Get product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} - Product object
 */
async function getProductById(id) {
  const params = {
    TableName: tableName,
    Key: { id },
  };

  try {
    const response = await dynamoDBDocClient.send(new GetCommand(params));
    return response.Item;
  } catch (error) {
    console.error("Error getting product from DynamoDB:", error);
    throw error;
  }
}

/**
 * Create new product
 * @param {Object} productData - Product data (name, price, quantity, url_image)
 * @returns {Promise<Object>} - Created product
 */
async function createProduct(productData) {
  const product = {
    id: uuidv4(),
    name: productData.name,
    price: parseFloat(productData.price),
    quantity: parseInt(productData.quantity),
    url_image: productData.url_image,
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: tableName,
    Item: product,
  };

  try {
    await dynamoDBDocClient.send(new PutCommand(params));
    return product;
  } catch (error) {
    console.error("Error creating product in DynamoDB:", error);
    throw error;
  }
}

/**
 * Update product
 * @param {string} id - Product ID
 * @param {Object} updateData - Data to update (name, price, quantity, url_image)
 * @returns {Promise<Object>} - Updated product
 */
async function updateProduct(id, updateData) {
  const updateExpressions = [];
  const expressionAttributeValues = {};
  const expressionAttributeNames = {};

  if (updateData.name !== undefined) {
    updateExpressions.push("#name = :name");
    expressionAttributeValues[":name"] = updateData.name;
    expressionAttributeNames["#name"] = "name";
  }

  if (updateData.price !== undefined) {
    updateExpressions.push("price = :price");
    expressionAttributeValues[":price"] = parseFloat(updateData.price);
  }

  if (updateData.quantity !== undefined) {
    updateExpressions.push("quantity = :quantity");
    expressionAttributeValues[":quantity"] = parseInt(updateData.quantity);
  }

  if (updateData.url_image !== undefined) {
    updateExpressions.push("url_image = :url_image");
    expressionAttributeValues[":url_image"] = updateData.url_image;
  }

  updateExpressions.push("updatedAt = :updatedAt");
  expressionAttributeValues[":updatedAt"] = new Date().toISOString();

  const params = {
    TableName: tableName,
    Key: { id },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ...(Object.keys(expressionAttributeNames).length > 0 && {
      ExpressionAttributeNames: expressionAttributeNames,
    }),
    ReturnValues: "ALL_NEW",
  };

  try {
    const response = await dynamoDBDocClient.send(new UpdateCommand(params));
    return response.Attributes;
  } catch (error) {
    console.error("Error updating product in DynamoDB:", error);
    throw error;
  }
}

/**
 * Delete product
 * @param {string} id - Product ID
 * @returns {Promise<void>}
 */
async function deleteProduct(id) {
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
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
