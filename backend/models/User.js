const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/frontend/public/images/avatar.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();


  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.salt = salt;
  user.password = hashedPassword;

  next();
});

userSchema.statics.matchPassword = async function (email, password) {
    const user = await this.findOne({ email });  // Fix: Add `await` to fetch user
    if (!user) throw new Error("User not found!");


    const salt = user.salt;
    const hashedPassword = user.password;

    // Fix: Use the provided password, not user.password
    const userProvidedHash = createHmac("sha256", salt)
        .update(password)  // Fix: Use `password`, not `user.password`
        .digest("hex");

    if (hashedPassword !== userProvidedHash) throw new Error("Incorrect Password");

    return user;
};


const User = model("User", userSchema);

module.exports = User;
