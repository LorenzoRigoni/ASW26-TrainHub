const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getMyNutritionRequests,
    getNutritionRequestById,
    createNutritionRequest,
    updateNutritionRequest,
    deleteNutritionRequest
} = require('../controllers/nutritionRequestController');

/**
 * @swagger
 * /api/nutrition-requests:
 *   get:
 *     summary: Get all nutrition requests for the logged trainer or nutritionist
 *     tags: [Nutrition Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Nutrition requests retrieved
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
 *                     $ref: '#/components/schemas/NutritionRequest'
 *       401:
 *         description: Unauthorized
 */
router.get('/', protect, authorize('trainer', 'nutritionist'), getMyNutritionRequests);

/**
 * @swagger
 * /api/nutrition-requests/{id}:
 *   get:
 *     summary: Get a nutrition request by id
 *     tags: [Nutrition Requests]
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
 *         description: Nutrition request retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/NutritionRequest'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request not found
 */
router.get('/:id', protect, authorize('trainer', 'nutritionist'), getNutritionRequestById);

/**
 * @swagger
 * /api/nutrition-requests:
 *   post:
 *     summary: Create a new nutrition request
 *     tags: [Nutrition Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - nutritionistId
 *               - title
 *               - goal
 *               - startDate
 *               - endDate
 *             properties:
 *               clientId:
 *                 type: string
 *               nutritionistId:
 *                 type: string
 *               title:
 *                 type: string
 *               goal:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Nutrition request created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, authorize('trainer'), createNutritionRequest);

/**
 * @swagger
 * /api/nutrition-requests/{id}:
 *   put:
 *     summary: Update a nutrition request
 *     tags: [Nutrition Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ['In attesa', 'In elaborazione', 'Completata', 'Rifiutata']
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Request updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request not found
 */
router.put('/:id', protect, authorize('trainer', 'nutritionist'), updateNutritionRequest);

/**
 * @swagger
 * /api/nutrition-requests/{id}:
 *   delete:
 *     summary: Delete a nutrition request
 *     tags: [Nutrition Requests]
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
 *         description: Request deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request not found
 */
router.delete('/:id', protect, authorize('trainer'), deleteNutritionRequest);

module.exports = router;
