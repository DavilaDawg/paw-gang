import mongoose from 'mongoose';

export const connectToDatabase = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/pawgang');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('error', error);
  }
};

