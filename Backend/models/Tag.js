import { Schema, model } from "mongoose";

const TagSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});

TagSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
});

TagSchema.set('toObject', {
    transform: function (doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
});

export default model("Tag", TagSchema);