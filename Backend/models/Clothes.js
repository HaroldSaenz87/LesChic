import { model, Schema } from "mongoose";

const ClothesSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        default: "images/default.jpg"
    },
    size: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        default: "unbranded"
    },
    type: {
        type: String,
        required: true
    },
    palette: {
        type: String,
        required: true
    },
    lastUsed: {
        type: Date,
        required: true
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tags'
    }]
});

export default model('Clothes', ClothesSchema);