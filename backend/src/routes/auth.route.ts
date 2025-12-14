import multer from 'multer';
import express, { Router } from 'express';
import {
  registerUser,
  loginUser,
  refreshUser,
} from '../controllers/auth.controller';

import { upload } from '../middlewares/multerMiddleware';

// for single file upload
// upload.single('avatar');

// for multiple files upload
// upload.array('photos', 12); // 12 is max count of files

// for fields
// upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'photos', maxCount: 12 }]);

// insert middleware 'upload' where file upload is needed

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/refresh', refreshUser);

// Multer error handling middleware
router.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  },
);

export default router;
