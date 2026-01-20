import express from 'express';
import db from '../db/mysql.js';

const router = express.Router();


router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const [users] = await db.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password]
    );

    if (users.length > 0) {
        req.session.user = users[0];
        res.redirect('/');
    } else {
        res.render('login', { error: 'Sai tài khoản hoặc mật khẩu!' });
    }
});
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

export default router;
