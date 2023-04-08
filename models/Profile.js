import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        categories: {
            type: [String],
            default: [],
        },
        languages: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
