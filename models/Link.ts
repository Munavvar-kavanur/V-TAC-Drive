import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    originalUrl: {
        type: String,
        required: true,
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    type: {
        type: String,
        enum: ['drive', 'url'],
        default: 'url',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    expiresAt: {
        type: Date,
    },
    clicks: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { bufferCommands: false });

export default mongoose.models.Link || mongoose.model('Link', LinkSchema);
