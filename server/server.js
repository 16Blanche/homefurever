require('dotenv').config({ path: "../.env" });
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('Environment Variables:', process.env);

const express = require("express");
const app = express();
const port = 8000;  
const nodemailer = require('nodemailer');
require("./config/mongo_config");
const cors = require("cors");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

app.use(express.json(), express.urlencoded({ extended: true }), cors());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"], 
    credentials: true
}));

app.use((req, res, next) => {
    console.log('Authorization header:', req.headers['authorization']);
    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

const UserRoutes = require("./routes/data_routes");
UserRoutes(app, upload);

app.listen(port, () => console.log("The server is all fired up on port 8000."));
