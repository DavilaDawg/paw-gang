import mongoose from 'mongoose';
import 'dotenv/config';

const IP = process.env.IP

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(`mongodb://${IP}:27017/pawgang`);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('error', error);
  }
};

export default connectToDatabase;
