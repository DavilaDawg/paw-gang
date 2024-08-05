import mongoose from 'mongoose';

const { Schema } = mongoose;

const blockedUserSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1h',  
    },
});

export const BlockedUser = mongoose.model('BlockedUser', blockedUserSchema);
