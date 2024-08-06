import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    userId: { type: String, required: true },
    password: { type: String, required: true },
});

userSchema.set('toJSON', { getters: true });

export const User = mongoose.model('User', userSchema);
