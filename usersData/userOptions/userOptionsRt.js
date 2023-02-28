const router = require("express").Router();
const {
  getAllUser,
  deleteUser,
  updateUser,
  forgotPassword,
  resetPassword,
} = require("./userOptionsCt");

router.get("/", getAllUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/forgot-password", forgotPassword);
router.post("/reset/:token", resetPassword);

module.exports = router;
