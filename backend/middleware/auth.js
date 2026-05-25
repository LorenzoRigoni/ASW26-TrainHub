const jwt = require("jsonwebtoken");
const user = require("../models/user");

/**
 * Middleware to protect routes by checking the JWT token
 * 
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized to access this route, no token provided"
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await user.findById(decodedToken.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};

/**
 * Middleware to authorize only specific roles. Example: view all athlete diaries => authorize('trainer', 'nutritionist').
 * 
 * @param  {...String} roles The authorized roles 
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }

        next();
    };
};

/**
 * Middleware to check if the logged user can access to athletes informations.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.authorizeAthleteAccess = async (req, res, next) => {
    try {
        const clientId = req.params.clientId || req.params.athleteId || req.params.id;

        if (!clientId) {
            return res.status(400).json({
                success: false,
                message: 'Client ID is required'
            });
        }

        // Same user
        if (req.user.id === clientId) {
            return next();
        }

        // Trainer user, check if the athlete is assigned to him
        if (req.user.role === 'trainer') {
            const client = await user.findById(clientId);

            if (!client) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
                });
            }

            if (client.assignedTrainerId && client.assignedTrainerId.toString() === req.user.id) {
                return next();
            }
        }

        // Nutritionist user, check if the athlete is assigned to him
        if (req.user.role === 'nutritionist') {
            const client = await user.findById(clientId);

            if (!client) {
                return res.status(404).json({
                    success: false,
                    message: 'Client not found'
                });
            }

            if (client.assignedNutritionistId && client.assignedNutritionistId.toString() === req.user.id) {
                return next();
            }
        }

        // No permissions
        return res.status(403).json({
            success: false,
            message: 'Not authorized to access this client data'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error checking authorization',
            error: error.message
        });
    }
};