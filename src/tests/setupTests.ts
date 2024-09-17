import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_ACCESS_KEY}/${process.env.MONGO_DB}?retryWrites=true&w=majority`);
});

afterAll(async () => {
  await mongoose.disconnect();
});