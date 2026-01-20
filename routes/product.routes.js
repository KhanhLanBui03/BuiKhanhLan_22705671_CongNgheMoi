import express from 'express';
import db from '../db/mysql.js';

const router = express.Router();

// Home
router.get('/', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM products');
  res.render('products', { products: rows });
});

// Add product
router.post('/add', async (req, res) => {
  const { name, price, quantity } = req.body;

  await db.query(
    'INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)',
    [name, price, quantity]
  );

  res.redirect('/');
});
// Show edit form
router.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [id]
  );

  res.render('edit', { product: rows[0] });
});

// Update product
router.post('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;

  await db.query(
    'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?',
    [name, price, quantity, id]
  );

  res.redirect('/');
});

// ================= DELETE =================
router.get('/delete/:id', async (req, res) => {
  const { id } = req.params;

  await db.query(
    'DELETE FROM products WHERE id = ?',
    [id]
  );

  res.redirect('/');
});

export default router;
