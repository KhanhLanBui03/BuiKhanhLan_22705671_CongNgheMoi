const dynamoDB = require("../config/dynamodb");
const { v4: uuidv4 } = require("uuid");

const TABLE_NAME = "Products";

class Product {
  static async getAll() {
    const params = { TableName: TABLE_NAME };
    const data = await dynamoDB.scan(params).promise();
    return data.Items;
  }

  static async getById(id) {
    const params = { TableName: TABLE_NAME, Key: { id } };
    const data = await dynamoDB.get(params).promise();
    return data.Item;
  }

  static async create({ name, price, url_image }) {
    const product = { id: uuidv4(), name, price, url_image };
    const params = { TableName: TABLE_NAME, Item: product };
    await dynamoDB.put(params).promise();
    return product;
  }

  static async update(id, { name, price, url_image }) {
    const params = {
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: "set #n = :n, price = :p, url_image = :u",
      ExpressionAttributeNames: { "#n": "name" },
      ExpressionAttributeValues: { ":n": name, ":p": price, ":u": url_image },
      ReturnValues: "ALL_NEW",
    };
    const data = await dynamoDB.update(params).promise();
    return data.Attributes;
  }

  static async delete(id) {
    const params = { TableName: TABLE_NAME, Key: { id } };
    await dynamoDB.delete(params).promise();
    return true;
  }
}

module.exports = Product;
