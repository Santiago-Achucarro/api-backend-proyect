const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    fullName: { type: String, require: true },
    userName: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    profilePic: { type: String, default: "" },
    bio: { type: String, default: "" },
    password: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", schema)

schema.set("toJSON", {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});




module.exports = User