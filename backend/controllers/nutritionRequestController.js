const NutritionRequest = require('../models/nutritionRequest');
const User = require('../models/user');
const { handleError, badRequest, notFound, forbidden, requiredFields, isOwner } = require('./controllerHelpers');

exports.getMyNutritionRequests = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'trainer') {
            query = { trainerId: req.user.id };
        } else if (req.user.role === 'nutritionist') {
            query = { nutritionistId: req.user.id };
        } else {
            return forbidden(res, 'Only trainers and nutritionists can access requests');
        }

        const requests = await NutritionRequest.find(query)
            .populate('trainerId', 'name surname')
            .populate('clientId', 'name surname')
            .populate('nutritionistId', 'name surname')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        handleError(res, error, 'Error fetching nutrition requests');
    }
};

exports.createNutritionRequest = async (req, res) => {
    try {
        const { clientId, nutritionistId, title, goal, startDate, endDate, notes } = req.body;

        if (!requiredFields(req.body, ['clientId', 'nutritionistId', 'title', 'goal', 'startDate', 'endDate'])) {
            return badRequest(res, 'Missing required fields');
        }

        const request = await NutritionRequest.create({
            trainerId: req.user.id,
            clientId,
            nutritionistId,
            title,
            goal,
            startDate,
            endDate,
            notes
        });

        res.status(201).json({ success: true, data: request });
    } catch (error) {
        handleError(res, error, 'Error creating nutrition request');
    }
};

exports.updateNutritionRequest = async (req, res) => {
    try {
        const request = await NutritionRequest.findById(req.params.id);

        if (!request) return notFound(res);

        // Authorization: Trainers can edit their own requests if still pending
        // Nutritionists can update status
        if (req.user.role === 'trainer') {
            if (!isOwner(request.trainerId, req.user.id)) return forbidden(res);
            
            const { title, goal, startDate, endDate, notes, clientId, nutritionistId } = req.body;
            if (title) request.title = title;
            if (goal) request.goal = goal;
            if (startDate) request.startDate = startDate;
            if (endDate) request.endDate = endDate;
            if (notes) request.notes = notes;
            if (clientId) request.clientId = clientId;
            if (nutritionistId) request.nutritionistId = nutritionistId;
        } else if (req.user.role === 'nutritionist') {
            if (!isOwner(request.nutritionistId, req.user.id)) return forbidden(res);
            
            const { status } = req.body;
            if (status) request.status = status;
        } else {
            return forbidden(res);
        }

        await request.save();
        res.status(200).json({ success: true, data: request });
    } catch (error) {
        handleError(res, error, 'Error updating nutrition request');
    }
};

exports.deleteNutritionRequest = async (req, res) => {
    try {
        const request = await NutritionRequest.findById(req.params.id);

        if (!request) return notFound(res);

        if (!isOwner(request.trainerId, req.user.id)) {
            return forbidden(res);
        }

        await request.deleteOne();
        res.status(200).json({ success: true, message: 'Request deleted' });
    } catch (error) {
        handleError(res, error, 'Error deleting nutrition request');
    }
};
