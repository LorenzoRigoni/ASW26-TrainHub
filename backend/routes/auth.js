const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getUserInfo,
    updateProfile,
    updatePassword,
    logout
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login an user
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/userinfo
 * @desc    Get the logged user info
 * @access  Private
 */
router.get('/userinfo', protect, getUserInfo);

/**
 * @route   PUT /api/auth/updateprofile
 * @desc    Update an user profile
 * @access  Private
 */
router.put('/updateprofile', protect, updateProfile);

/**
 * @route   PUT /api/auth/updatepassword
 * @desc    Change the password
 * @access  Private
 */
router.put('/updatepassword', protect, updatePassword);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout
 * @access  Private
 */
router.post('/logout', protect, logout);

module.exports = router;