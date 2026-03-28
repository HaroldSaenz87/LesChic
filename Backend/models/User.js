import { model, Schema } from "mongoose";

const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    }
});

export default model('User', UserSchema);