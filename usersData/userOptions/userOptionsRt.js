const router = require("express").Router();
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
router.get("/forgot", forgotPassword);
router.get("/reset/:token", resetPassword);
router.post("/reset/:token", saveNewPass);

module.exports = router;
