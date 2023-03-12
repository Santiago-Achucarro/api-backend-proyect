const router = require("express").Router();
const { ValidatePassword } = require("../../validators/validateUsers");
const { verifyToken } = require("../config/handleJWT");
const {
  getAllUser,
  deleteUser,
  updateUser,
  forgotPassword,
  resetPassword,
  saveNewPass,
} = require("./userOptionsCt");

router.get("/", getAllUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.post("/forgot", forgotPassword);
router.get("/reset/:token", resetPassword);
router.post("/reset/:token", ValidatePassword, saveNewPass);

module.exports = router;
