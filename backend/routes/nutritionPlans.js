const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getMyNutritionPlans,
    getActiveNutritionPlan,
    getNutritionPlanById,
    getNutritionistPlans,
    createNutritionPlan,
    updateNutritionPlan,
    changeNutritionPlanStatus,
    deleteNutritionPlan
} = require('../controllers/nutritionPlanController');

// Client routes

/**
 * @route GET /api/nutrition-plans/my-plans
 * @desc Get all nutrition plans of the logged client
 * @access Private (client)
 */
router.get('/my-plans', protect, authorize('client'), getMyNutritionPlans);

/**
 * @route GET /api/nutrition-plans/active
 * @desc Get active nutrition plan of the logged client
 * @access Private (client)
 */
router.get('/active', protect, authorize('client'), getActiveNutritionPlan);

/**
 * @route GET /api/nutrition-plans/:id
 * @desc Get nutrition plan by ID
 * @access Private (client, nutritionist)
 */
router.get('/:id', protect, authorize('client', 'nutritionist'), getNutritionPlanById);

// Nutritionist routes

/**
 * @route GET /api/nutrition-plans/nutritionist/plans
 * @desc Get all nutrition plans created by the logged nutritionist
 * @access Private (nutritionist)
 */
router.get('/nutritionist/plans', protect, authorize('nutritionist'), getNutritionistPlans);

/**
 * @route POST /api/nutrition-plans
 * @desc Create a new nutrition plan
 * @access Private (nutritionist)
 */
router.post('/', protect, authorize('nutritionist'), createNutritionPlan);

/**
 * @route PATCH /api/nutrition-plans/:id
 * @desc Update nutrition plan
 * @access Private (nutritionist)
 */
router.patch('/:id', protect, authorize('nutritionist'), updateNutritionPlan);

/**
 * @route PATCH /api/nutrition-plans/:id/status
 * @desc Change nutrition plan status
 * @access Private (nutritionist)
 */
router.patch('/:id/status', protect, authorize('nutritionist'), changeNutritionPlanStatus);

/**
 * @route DELETE /api/nutrition-plans/:id
 * @desc Delete nutrition plan
 * @access Private (nutritionist)
 */
router.delete('/:id', protect, authorize('nutritionist'), deleteNutritionPlan);

module.exports = router;