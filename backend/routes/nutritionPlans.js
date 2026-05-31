const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const uploadPdf = require('../middleware/uploadPdf');
const {
    getMyNutritionPlans,
    getActiveNutritionPlan,
    getNutritionPlanById,
    getNutritionistPlans,
    createNutritionPlan,
    deleteNutritionPlan
} = require('../controllers/nutritionPlanController');

// Client routes

/**
 * @swagger
 * /api/nutrition-plans/my-plans:
 *   get:
 *     summary: Get all nutrition plans of the logged client
 *     tags: [Nutrition Plans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Nutrition plans retrieved
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
 *                     $ref: '#/components/schemas/NutritionPlan'
 *       401:
 *         description: Unauthorized
 */
router.get('/my-plans', protect, authorize('client'), getMyNutritionPlans);

/**
 * @swagger
 * /api/nutrition-plans/active:
 *   get:
 *     summary: Get active nutrition plan of the logged client
 *     tags: [Nutrition Plans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active nutrition plan retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/NutritionPlan'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No active plan found
 */
router.get('/active', protect, authorize('client'), getActiveNutritionPlan);

/**
 * @swagger
 * /api/nutrition-plans/{id}:
 *   get:
 *     summary: Get nutrition plan by ID
 *     tags: [Nutrition Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nutrition plan retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/NutritionPlan'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Plan not found
 */
router.get('/:id', protect, authorize('client', 'nutritionist'), getNutritionPlanById);

// Nutritionist routes

/**
 * @swagger
 * /api/nutrition-plans/nutritionist/plans:
 *   get:
 *     summary: Get all nutrition plans created by the logged nutritionist
 *     tags: [Nutrition Plans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Plans retrieved
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
 *                     $ref: '#/components/schemas/NutritionPlan'
 *       401:
 *         description: Unauthorized
 */
router.get('/nutritionist/plans', protect, authorize('nutritionist'), getNutritionistPlans);

/**
 * @swagger
 * /api/nutrition-plans:
 *   post:
 *     summary: Create a new nutrition plan
 *     tags: [Nutrition Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - athleteId
 *               - title
 *               - startDate
 *               - endDate
 *               - pdfFile
 *             properties:
 *               athleteId:
 *                 type: string
 *               title:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *               pdfFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Nutrition plan created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid input or file missing
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, authorize('nutritionist'), uploadPdf.single('pdfFile'), createNutritionPlan);

/**
 * @swagger
 * /api/nutrition-plans/{id}:
 *   delete:
 *     summary: Delete nutrition plan
 *     tags: [Nutrition Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plan deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Plan not found
 */
router.delete('/:id', protect, authorize('nutritionist'), deleteNutritionPlan);

module.exports = router;