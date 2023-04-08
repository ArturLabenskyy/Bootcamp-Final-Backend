import crypto from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a name"],
        },
        email: {
            type: String,
            required: [true, "Please add an email"],
            unique: [true, "Email address already taken"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please add a valid email",
            ],
        },
        password: {
            type: String,
            required: [true, "Please enter a password"],
            minlength: 6,
        },
        role: {
            type: String,
            enum: ["user", "publisher"],
            default: "user",
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    { timestamps: true },
    {
        toJSON: {
            transform(_, ret) {
                delete ret.password;
            },
        },
        toObject: {
            transform(_, ret) {
                delete ret.password;
            },
        },
    }
);

// encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
    // If the password has not been modified proceed to next middleware
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
    // Generate token - it returns a buffer, so we need to convert it to a string
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Set expire to 10 minutes
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

export default mongoose.model("User", UserSchema);
