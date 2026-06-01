const BodyDiary = require('../models/bodyDiary');
const { createNotification } = require('./notificationController');
const { handleError, badRequest, notFound, forbidden, requiredFields, getUserResource, getUserResources } = require('./controllerHelpers');

const parseDayRange = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

exports.getMyBodyDiary = async (req, res) => {
    try {
        const data = await getUserResources(BodyDiary, req.user.id);

        res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
        handleError(res, error, 'Error fetching body diary');
    }
};

exports.getBodyDiaryById = async (req, res) => {
    try {
        const { resource, error } = await getUserResource(BodyDiary, req.params.id, req.user.id);

        if (error === 'NOT_FOUND') return notFound(res);
        if (error === 'FORBIDDEN') return forbidden(res);

        res.status(200).json({ success: true, data: resource });
    } catch (err) {
        handleError(res, err, 'Error fetching body diary');
    }
};

exports.getBodyDiaryByDateRange = async (req, res) => {
    try {
        const start = new Date(req.params.startDate);
        const end = new Date(req.params.endDate);

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        if (start > end) {
            return res.status(400).json({ success: false, message: 'Invalid date range' });
        }

        const data = await getUserResources(BodyDiary, req.user.id, {
            date: { $gte: start, $lte: end }
        });

        res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
        handleError(res, error, 'Error fetching body diary by range');
    }
};

exports.createBodyDiary = async (req, res) => {
    try {
        const {
          date,
          activity,
          adherence,
          steps,
          hunger,
          weight,
          measurements,
          notes,
          energyLevel,
          sleepHours
        } = req.body;

        // Normalize date to 00:00:00 for the current day or provided date
        const targetDate = date ? new Date(date) : new Date();
        targetDate.setUTCHours(0, 0, 0, 0);

        // Check if an entry already exists for this date and athlete
        const existingEntry = await BodyDiary.findOne({
            athleteId: req.user.id,
            date: targetDate
        });

        if (existingEntry) {
            return res.status(400).json({
                success: false,
                message: 'Hai già inserito una registrazione per questa data. Modifica quella esistente se necessario.'
            });
        }

        const diary = await BodyDiary.create({
            athleteId: req.user.id,
            date: targetDate,
            activity: activity || 'on',
            adherence: adherence || 'Media',
            steps: steps ?? 0,
            hunger: hunger ?? 5,
            weight: weight || null,
            measurements: measurements || {},
            notes: notes || '',
            energyLevel: energyLevel || null,
            sleepHours: sleepHours || null
        });

        res.status(201).json({ success: true, data: diary });
    } catch (error) {
        handleError(res, error, 'Error creating body diary');
    }
};

exports.updateBodyDiary = async (req, res) => {
    try {
        const { resource, error } = await getUserResource(BodyDiary, req.params.id, req.user.id);

        if (error === 'NOT_FOUND') return notFound(res);
        if (error === 'FORBIDDEN') return forbidden(res);

        const {
          date,
          activity,
          adherence,
          steps,
          hunger,
          weight,
          measurements,
          notes,
          energyLevel,
          sleepHours
        } = req.body;

        if (date !== undefined) resource.date = new Date(date);
        if (activity !== undefined) resource.activity = activity;
        if (adherence !== undefined) resource.adherence = adherence;
        if (steps !== undefined) resource.steps = steps;
        if (hunger !== undefined) resource.hunger = hunger;
        if (weight !== undefined) resource.weight = weight;
        if (measurements) resource.measurements = { ...resource.measurements, ...measurements };
        if (notes !== undefined) resource.notes = notes;
        if (energyLevel !== undefined) resource.energyLevel = energyLevel;
        if (sleepHours !== undefined) resource.sleepHours = sleepHours;

        await resource.save();

        res.status(200).json({ success: true, data: resource });
    } catch (error) {
        handleError(res, error, 'Error updating body diary');
    }
};

exports.deleteBodyDiary = async (req, res) => {
    try {
        const { resource, error } = await getUserResource(BodyDiary, req.params.id, req.user.id);

        if (error === 'NOT_FOUND') return notFound(res);
        if (error === 'FORBIDDEN') return forbidden(res);

        await resource.deleteOne();

        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (error) {
        handleError(res, error, 'Error deleting body diary');
    }
};

exports.getBodyDiaryByAthleteId = async (req, res) => {
    try {
        const data = await getUserResources(BodyDiary, req.params.clientId);

        res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
        handleError(res, error, 'Error fetching body diary by athlete id');
    }
};
