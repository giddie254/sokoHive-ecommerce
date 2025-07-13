import multer from 'multer';

export const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('🛑 Multer error:', err);
    return res.status(400).json({ message: err.message });
  } else if (err) {
    console.error('🛑 Unexpected upload error:', err);
    return res.status(500).json({ message: 'Upload failed', error: err.message });
  }
  next();
};
