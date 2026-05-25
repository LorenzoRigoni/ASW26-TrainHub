const NutritionPlan = require('../models/nutritionPlan');
const User = require('../models/user');
const { createNotification } = require('./notificationController');
const { handleError, badRequest, forbidden, notFound, requiredFields, isOwner } = require('./controllerHelpers');

const getPlan = async (id) => {
    const plan = await NutritionPlan.findById(id)
        .populate('nutritionistId', 'name surname username')
        .populate('athleteId', 'name surname username');

    if (!plan) return { error: 'NOT_FOUND' };
    return { plan };
};

const checkAccess = (plan, user) => {
    if (user.role === 'client' && !isOwner(plan.athleteId._id, user.id)) return 'FORBIDDEN';
    if (user.role === 'nutritionist' && !isOwner(plan.nutritionistId._id, user.id)) return 'FORBIDDEN';
    return null;
};

exports.getMyNutritionPlans = async (req, res) => {
    try {
        const plans = await NutritionPlan.find({ athleteId: req.user.id })
            .populate('nutritionistId', 'name surname username')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: plans.length, data: plans });
    } catch (error) {
        handleError(res, error, 'Error fetching nutrition plans');
    }
};

exports.getActiveNutritionPlan = async (req, res) => {
    try {
        const plan = await NutritionPlan.findOne({ athleteId: req.user.id, planStatus: 'active' })
            .populate('nutritionistId', 'name surname username');

        if (!plan) return notFound(res, 'No active nutrition plan');

        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        handleError(res, error, 'Error fetching active nutrition plan');
    }
};

exports.getNutritionPlanById = async (req, res) => {
    try {
        const { plan, error } = await getPlan(req.params.id);

        if (error === 'NOT_FOUND') return notFound(res);

        const accessError = checkAccess(plan, req.user);
        if (accessError) return forbidden(res);

        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        handleError(res, error, 'Error fetching nutrition plan');
    }
};

exports.getNutritionistPlans = async (req, res) => {
    try {
        const plans = await NutritionPlan.find({ nutritionistId: req.user.id })
            .populate('athleteId', 'name surname username')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: plans.length, data: plans });
    } catch (error) {
        handleError(res, error, 'Error fetching nutritionist plans');
    }
};

exports.createNutritionPlan = async (req, res) => {
    try {
        const { athleteId, title, description, dailyCalories, macros, meals, notes, startDate, endDate } = req.body;

        if (!requiredFields(req.body, ['athleteId'])) {
            return badRequest(res, 'Athlete ID is required');
        }

        // Verify athlete exists and is a client
        const athlete = await User.findById(athleteId);
        if (!athlete || athlete.role !== 'client') {
            return badRequest(res, 'Invalid athlete');
        }

        const plan = await NutritionPlan.create({
            athleteId,
            nutritionistId: req.user.id,
            title: title || 'Piano nutrizionale',
            description,
            dailyCalories,
            macros,
            meals,
            notes,
            startDate: startDate ? new Date(startDate) : Date.now(),
            endDate: endDate ? new Date(endDate) : Date.now()
        });

        // Create notification for athlete
        await createNotification(
            athleteId,
            'nutrition_plan',
            'Nuovo piano alimentare',
            `Hai ricevuto un nuovo piano alimentare: ${plan.title}`,
            plan._id,
            'NutritionPlan'
        );

        res.status(201).json({ success: true, data: plan });
    } catch (error) {
        handleError(res, error, 'Error creating nutrition plan');
    }
};

exports.updateNutritionPlan = async (req, res) => {
    try {
        const { plan, error } = await getPlan(req.params.id);

        if (error === 'NOT_FOUND') return notFound(res);

        const accessError = checkAccess(plan, req.user);
        if (accessError) return forbidden(res);

        const { title, description, dailyCalories, macros, meals, notes } = req.body;

        if (title !== undefined) plan.title = title;
        if (description !== undefined) plan.description = description;
        if (dailyCalories !== undefined) plan.dailyCalories = dailyCalories;
        if (macros) plan.macros = { ...plan.macros, ...macros };
        if (meals) plan.meals = meals;
        if (notes !== undefined) plan.notes = notes;

        await plan.save();

        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        handleError(res, error, 'Error updating nutrition plan');
    }
};

exports.changeNutritionPlanStatus = async (req, res) => {
    try {
        const { plan, error } = await getPlan(req.params.id);

        if (error === 'NOT_FOUND') return notFound(res);

        const accessError = checkAccess(plan, req.user);
        if (accessError) return forbidden(res);

        const { status } = req.body;

        if (!['draft', 'active', 'archived'].includes(status)) {
            return badRequest(res, 'Invalid status');
        }

        plan.planStatus = status;
        await plan.save();

        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        handleError(res, error, 'Error changing nutrition plan status');
    }
};

exports.deleteNutritionPlan = async (req, res) => {
    try {
        const { plan, error } = await getPlan(req.params.id);

        if (error === 'NOT_FOUND') return notFound(res);

        const accessError = checkAccess(plan, req.user);
        if (accessError) return forbidden(res);

        await plan.deleteOne();

        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error) {
        handleError(res, error, 'Error deleting nutrition plan');
    }
};