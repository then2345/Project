const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const authGuard = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authGuard, getMe); // Route này được bảo vệ bởi authGuard

module.exports = router;
