import multer, { StorageEngine } from 'multer';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';

// Create folder if missing
const tempPath = path.join(process.cwd(), 'public', 'temp');
if (!fs.existsSync(tempPath)) {
  fs.mkdirSync(tempPath, { recursive: true });
}

const storage: StorageEngine = multer.diskStorage({
  destination: function (_req: Request, _file, cb) {
    cb(null, tempPath);
  },

  filename: function (_req: Request, file, cb) {
    // Generate unique filename for solving conflicts
    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
});
