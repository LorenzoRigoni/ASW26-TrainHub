const handleError = (res, error, message = 'Server error') => {
    // Mongoose Validation Error
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            message: messages.join(', '),
            error: error.message
        });
    }

    // Mongoose Duplicate Key Error
    if (error.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Un elemento con questi dati esiste già (duplicato)',
            error: error.message
        });
    }

    return res.status(500).json({
        success: false,
        message,
        error: error.message
    });
};

const badRequest = (res, message = 'Missing required fields') => {
    return res.status(400).json({
        success: false,
        message
    });
};

const notFound = (res, message = 'Not found') => {
    return res.status(404).json({
        success: false,
        message
    });
};

const forbidden = (res, message = 'Unauthorized') => {
    return res.status(403).json({
        success: false,
        message
    });
};

const requiredFields = (body, fields) => {
    return fields.every(field => body[field] !== undefined && body[field] !== null);
};

const isOwner = (id1, id2) => {
    return id1?.toString() === id2?.toString();
};

const getUserResource = async (Model, id, userId, ownerField = 'athleteId') => {
    const resource = await Model.findById(id);
    if (!resource) return { error: 'NOT_FOUND' };
    if (!isOwner(resource[ownerField], userId)) return { error: 'FORBIDDEN' };
    return { resource };
};

const getUserResources = (Model, userId, filter = {}, sort = { date: -1 }, userField = 'athleteId') => {
    return Model.find({ [userField]: userId, ...filter }).sort(sort);
};

module.exports = {
    handleError,
    badRequest,
    notFound,
    forbidden,
    requiredFields,
    isOwner,
    getUserResource,
    getUserResources
};
