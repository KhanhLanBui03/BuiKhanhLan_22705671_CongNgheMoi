import express from 'express';
import session from 'express-session';

import authRoutes from '../routes/auth.routes.js';
import productRoutes from '../routes/product.routes.js';

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Body parser
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  secret: 'secret_key_bat_ky',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 } // 60 phút
}));

// Middleware check login
const requireLogin = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect('/login');
};

// Routes
app.use('/', authRoutes);                 // public
app.use('/', requireLogin, productRoutes); // protected

app.listen(4000, () => {
  console.log('🚀 Server running at http://localhost:4000');
});
