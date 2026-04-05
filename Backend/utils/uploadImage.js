import multer from 'multer';
import path from "path";
import fs from "fs";


const uploadDir = "public/images";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e5)}${ext}`;
        cb(null, uniqueName);
    }
});

export const uploadImage = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});
