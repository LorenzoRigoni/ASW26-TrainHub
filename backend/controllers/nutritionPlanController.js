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
        const today = new Date();

        const plan = await NutritionPlan.findOne({ 
            athleteId: req.user.id,
            startDate: { $lte: today },
            endDate: { $gte: today }
        })
        .populate('nutritionistId', 'name surname username');

        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        handleError(res, error, 'Errore nel recupero del piano alimentare attivo');
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
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Nessun file PDF caricato' });
        }

        const { title, athleteId, startDate, endDate, notes } = req.body;

        const pdfUrl = `/uploads/nutrition_plans/${req.file.filename}`;

        const plan = await NutritionPlan.create({
            title,
            athleteId,
            nutritionistId: req.user.id,
            pdfUrl,
            startDate,
            endDate,
            notes
        });

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