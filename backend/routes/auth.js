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
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Creates a new user (default role is client)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - name
 *               - surname
 *             properties:
 *               username:
 *                 type: string
 *                 example: mario.rossi
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 enum: [client, trainer, nutritionist]
 *                 example: client
 *               name:
 *                 type: string
 *                 example: Mario
 *               surname:
 *                 type: string
 *                 example: Rossi
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Server error
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login an user
 * @access  Public
 */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user and return token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@test.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/userinfo
 * @desc    Get the logged user info
 * @access  Private
 */
/**
 * @swagger
 * /api/auth/userinfo:
 *   get:
 *     summary: Get logged user info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data returned
 */
router.get('/userinfo', protect, getUserInfo);

/**
 * @route   PUT /api/auth/updateprofile
 * @desc    Update an user profile
 * @access  Private
 */
/**
 * @swagger
 * /api/auth/updateprofile:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/updateprofile', protect, updateProfile);

/**
 * @route   PUT /api/auth/updatepassword
 * @desc    Change the password
 * @access  Private
 */
/**
 * @swagger
 * /api/auth/updatepassword:
 *   put:
 *     summary: Update password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 */
router.put('/updatepassword', protect, updatePassword);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout
 * @access  Private
 */
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 */
router.post('/logout', protect, logout);

module.exports = router;