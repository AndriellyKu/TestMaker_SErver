const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name:"dhodslcml",
  api_key:"742196189844156",
  api_secret:"zYLHb9nZylqsWBcIPxI2m9WWSyw"
  });

  

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
    folder: 'bancoImagens', 
    allowed_formats: ['jpg', 'png', 'jpeg'], 
        },
});

const upload = multer({ storage: storage });


router.post('/register', upload.single('pr\ofilePicture'), register);

router.post('/login', login);

module.exports = router;
