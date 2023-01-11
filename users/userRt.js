const router = require("express").Router();
const uploadPic = require("./config/handleStorage");
const { getAlluser, addUser, deleteUser, updateUser } = require("./userCt");
router.get("/", getAlluser);
router.post("/", uploadPic.single("profilePic"), addUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
