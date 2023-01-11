const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const pathStorage = `${__dirname}/../public/storage`;
    callback(null, pathStorage);
  },
  filename: (req, file, callback) => {
    const ext = file.originalname.split(".").pop();
    const filename = `usrPic_${Date.now()}.${ext}`;
    callback(null, filename);
  },
});

const uploadPic = multer({ storage });
module.exports = uploadPic;
