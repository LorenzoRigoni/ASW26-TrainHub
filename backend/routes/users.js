const express = require('express');
const router = express.Router();
const { protect, authorize, authorizeAthleteAccess } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getMyClients,
  getTrainerStats,
  getTrainerProgramsList,
  getAthleteDetail,
  assignTrainerToAthlete,
  assignNutritionistToAthlete,
  getAllTrainers,
  getAllNutritionists,
  getNutritionistAthletes,
  updateProfile,
  uploadAvatar
} = require('../controllers/userController');

/**
 * @swagger
 * /api/users/my-clients:
 *   get:
 *     summary: Get all the clients assigned to the logged trainer or nutritionist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Clients retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/my-clients', protect, authorize('trainer', 'nutritionist'), getMyClients);

/**
 * @swagger
 * /api/users/trainer-stats:
 *   get:
 *     summary: Get the stats of the trainer
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/trainer-stats', protect, authorize('trainer'), getTrainerStats);

/**
 * @swagger
 * /api/users/programs-list:
 *   get:
 *     summary: Get the list of the programs created by the trainer
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Programs list retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TrainingProgram'
 *       401:
 *         description: Unauthorized
 */
router.get('/programs-list', protect, authorize('trainer'), getTrainerProgramsList);

/**
 * @swagger
 * /api/users/{athleteId}/assign-trainer:
 *   put:
 *     summary: Assign trainer to athlete
 *     description: Assign a trainer to an athlete. If trainerId is not provided, the authenticated trainer is assigned automatically.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: athleteId
 *         required: true
 *         schema:
 *           type: string
 *         description: Athlete user id
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trainerId:
 *                 type: string
 *                 example: 684d4f8c999999999999999
 *           examples:
 *             assignLoggedTrainer:
 *               summary: Assign authenticated trainer
 *               value: {}
 *             assignSpecificTrainer:
 *               summary: Assign specific trainer
 *               value:
 *                 trainerId: 684d4f8c999999999999999
 *     responses:
 *       200:
 *         description: Trainer assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Trainer or athlete not found
 *       500:
 *         description: Server error
 */
router.put('/:athleteId/assign-trainer', protect, authorize('trainer'), assignTrainerToAthlete);

/**
 * @swagger
 * /api/users/{athleteId}/assign-nutritionist:
 *   put:
 *     summary: Assign a nutritionist to athlete
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: athleteId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nutritionistId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nutritionist assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Nutritionist or athlete not found
 */
router.put('/:athleteId/assign-nutritionist', protect, authorize('nutritionist'), assignNutritionistToAthlete);

/**
 * @swagger
 * /api/users/trainers:
 *   get:
 *     summary: Get all the trainers
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Trainers retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/trainers', getAllTrainers);

/**
 * @swagger
 * /api/users/nutritionists:
 *   get:
 *     summary: Get all the nutritionists
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Nutritionists retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/nutritionists', getAllNutritionists);

/**
 * @swagger
 * /api/users/athlete/{athleteId}:
 *   get:
 *     summary: Get all the details of an athlete
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: athleteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Athlete details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Athlete not found
 */
router.get('/athlete/:athleteId', protect, authorizeAthleteAccess, getAthleteDetail);

/**
 * @swagger
 * /api/users/update:
 *   put:
 *     summary: Update profile (alternative endpoint)
 *     tags: [Users]
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
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 */
router.put('/update', protect, updateProfile);

/**
 * @swagger
 * /api/users/upload-avatar:
 *   post:
 *     summary: Upload profile picture
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: No file uploaded
 */
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;