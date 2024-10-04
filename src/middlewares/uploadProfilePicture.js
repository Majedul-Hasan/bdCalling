const multer = require('multer');
const path = require('path');

// const upload = multer({ dest: 'public/uploads/' });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// Multer file filter to allow only certain types of files (e.g., images)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg, and .png formats are allowed!'));
  }
};

// Initialize the multer upload
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit to 5MB
  fileFilter,
});

// Middleware for optional profile picture upload
const uploadProfilePicture = upload.single('avatar');
module.exports = { uploadProfilePicture };
