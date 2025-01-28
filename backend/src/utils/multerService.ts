import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const sanitizedFileName = file.originalname.replace(/\s+/g, '-');
      cb(null, `${Date.now()}-${sanitizedFileName}`);
       // Unique file name
    },
});

// Export the multer instance
export const upload = multer({ storage });
