const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dir = 'uploads/nutrition_plans/';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Il file deve essere un PDF valido!'), false);
    }
};

const uploadPdf = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    // Max 10 MB
    limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = uploadPdf;