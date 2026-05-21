const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
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

//Routes for trainer

/**
 * @route GET /api/users/my-clients
 * @desc Get all the clients assigned to the logged trainer
 * @access Private (trainer)
 */
router.get('/my-clients', protect, authorize('trainer'), getMyClients);

/**
 * @route GET /api/users/trainer-stats
 * @desc Get the stats of the trainer
 * @access Private (trainer)
 */
router.get('/trainer-stats', protect, authorize('trainer'), getTrainerStats);

/**
 * @route GET /api/users/programs-list
 * @desc Get the list of the programs created by the trainer
 * @access Private (trainer)
 */
router.get('/programs-list', protect, authorize('trainer'), getTrainerProgramsList);

/**
 * @route PUT /api/users/:athleteId/assign-trainer
 * @desc Assign a trainer to athlete
 * @access Private (trainer)
 */
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Trainer assigned successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     athleteId:
 *                       type: string
 *                     athleteName:
 *                       type: string
 *                     trainerId:
 *                       type: string
 *                     trainerName:
 *                       type: string
 *       404:
 *         description: Trainer or athlete not found
 *       500:
 *         description: Server error
 */
router.put('/:athleteId/assign-trainer', protect, authorize('trainer'), assignTrainerToAthlete);

//Routes for nutritionist

/**
 * @route GET /api/users/my-nutrition-athletes
 * @desc Get all the athletes assigned to the logged nutritionist
 * @access Private (nutritionist)
 */
//router.get('/my-nutrition-athletes', protect, authorize('nutritionist'), getNutritionistAthletes);

/**
 * @route PUT /api/users/:athleteId/assign-nutritionist
 * @desc Assign a nutritionist to athlete
 * @access Private (nutritionist)
 */
router.put('/:athleteId/assign-nutritionist', protect, authorize('nutritionist'), assignNutritionistToAthlete);

//General routes

/**
 * @route GET /api/users/trainers
 * @desc Get all the trainers
 * @access Public
 */
router.get('/trainers', getAllTrainers);

/**
 * @route GET /api/users/nutritionists
 * @desc Get all the nutritionists
 * @access Public
 */
router.get('/nutritionists', getAllNutritionists);

/**
 * @route GET /api/users/athlete/:athleteId
 * @desc Get all the details of an athlete
 * @access Private (trainer and nutritionist)
 */
//router.get('/athlete/:athleteId', protect, authorize('trainer', 'nutritionist'), getAthleteDetail);

router.put('/update', protect, updateProfile);

// Rotta per la foto profilo (usa lo stesso nome del campo del frontend: 'avatar')
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;