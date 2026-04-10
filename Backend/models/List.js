import { model, Schema } from "mongoose";

const ListSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    clothes: [{
        type: Schema.Types.ObjectId,
        ref: 'Clothes'
    }],
    lastUsed: {
        type: Date,
        required: true
    },
    plannedUsed: [{
        type: Date,
        required: true
    }]
});

ListSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
});

ListSchema.set('toObject', {
    transform: function (doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
});

export default model('List', ListSchema);