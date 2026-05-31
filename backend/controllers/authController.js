const User = require('../models/user')

/**
 * Register of the user.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.register = async (req, res) => {
    try {
        const { username, password, role, name, surname, dateOfBirth } = req.body;

        if (!username || !password || !name || !surname) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username, password, name and surname'
            });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this username'
            });
        }

        const validRoles = ['client', 'trainer', 'nutritionist'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be client, trainer or nutritionist'
            });
        }

        const user = await User.create({
            username,
            password,
            role: role || 'client',
            name,
            surname,
            dateOfBirth
        });

        sendTokenResponse(user, 201, res, 'User registered successfully');
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};

/**
 * Login of the user.
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username and password'
            });
        }

        const user = await User.findOne({ username }).select(
            '+password -assignedTrainerId -assignedNutritionistId'
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        sendTokenResponse(user, 200, res, 'Login successful');

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

/**
 * Get information of the user.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.getUserInfo = async (req, res) => {
    try {
        const loggedUser = await User.findById(req.user.id)
            .select('username name surname role email profilePicture dateOfBirth') 
            .populate('assignedTrainerId', 'name surname username')
            .populate('assignedNutritionistId', 'name surname username');

        if (!loggedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: loggedUser
        });

    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile',
            error: error.message
        });
    }
};

/**
 * Update personal info.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.updateProfile = async (req, res) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            surname: req.body.surname,
            dateOfBirth: req.body.dateOfBirth
        };

        Object.keys(fieldsToUpdate).forEach(key =>
            fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );

        const loggedUser = await User.findByIdAndUpdate(
            req.user.id,
            fieldsToUpdate,
            {
                new: true,
                runValidators: true
            }
        );

        if (!loggedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: loggedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

/**
 * Update the password.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.updatePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide new password'
            });
        }

        const loggedUser = await User.findById(req.user.id).select('+password');

        if (!loggedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        loggedUser.password = newPassword;
        await loggedUser.save();

        sendTokenResponse(loggedUser, 200, res, 'Password updated successfully');

    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating password',
            error: error.message
        });
    }
};

/**
 * Logout.
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
        data: {}
    });
};


const sendTokenResponse = (user, statusCode, res, message) => {
    const token = user.getJwtToken(); 

    const userObject = user.toObject();
    delete userObject.password;

    res.status(statusCode).json({
        success: true,
        message: message,
        token: token,
        data: userObject
    });
};