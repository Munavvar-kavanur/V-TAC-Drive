import mongoose from 'mongoose';

const ClickSchema = new mongoose.Schema({
    linkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Link',
        required: true,
    },
    ipHash: {
        type: String,
    },
    userAgent: {
        type: String,
    },
    country: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
}, { bufferCommands: false });

export default mongoose.models.Click || mongoose.model('Click', ClickSchema);
