import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI as string;
export const connectDB = async (): Promise<void> => {
  if (!mongoURI) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }
  try {
    const mongoInstance = await mongoose.connect(mongoURI);
    console.log(
      'MONGODB CONNECTED SUCCESSFULLY: ',
      mongoInstance.connection.host,
    );
  } catch (error) {
    console.error('MONGODB CONNECTION FAILED:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MONGODB DISCONNECTED SUCCESSFULLY');
  } catch (error) {
    console.error('MONGODB DISCONNECTION FAILED:', error);
  }
};
