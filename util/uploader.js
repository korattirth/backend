const multer = require('multer');

const fileStorage = multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null,Math.random() + file.originalname);
    },
  });

const upload = multer({ storage: fileStorage }); 

module.exports = upload;