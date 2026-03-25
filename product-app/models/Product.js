const {
  PutCommand, GetCommand, DeleteCommand, ScanCommand, UpdateCommand
} = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLE_NAME } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Product = {
  async getAll(search = '') {
    const result = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    let items = result.Items || [];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(p => p.name && p.name.toLowerCase().includes(q));
    }
    // Sort by name
    items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    return items;
  },

  async getById(id) {
    const result = await docClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    }));
    return result.Item;
  },

  async create(data) {
    const item = {
      id: uuidv4(),
      name: data.name,
      price: parseFloat(data.price) || 0,
      unit_in_stock: parseInt(data.unit_in_stock) || 0,
      url_image: data.url_image || '',
    };
    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
    return item;
  },

  async update(id, data) {
    const updates = {
      '#n': 'name',
      price: 'price',
      unit_in_stock: 'unit_in_stock',
    };

    let UpdateExpression = 'SET #n = :name, price = :price, unit_in_stock = :unit_in_stock';
    let ExpressionAttributeValues = {
      ':name': data.name,
      ':price': parseFloat(data.price) || 0,
      ':unit_in_stock': parseInt(data.unit_in_stock) || 0,
    };

    if (data.url_image) {
      UpdateExpression += ', url_image = :url_image';
      ExpressionAttributeValues[':url_image'] = data.url_image;
    }

    await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression,
      ExpressionAttributeNames: { '#n': 'name' },
      ExpressionAttributeValues,
    }));
  },

  async delete(id) {
    await docClient.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
    }));
  },
};

module.exports = Product;
