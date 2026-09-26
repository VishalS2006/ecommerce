import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'memory';

  if (uri !== 'memory') {
    try {
      console.log(`Connecting to MongoDB at: ${uri}`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`Failed to connect to primary MongoDB (${err.message}). Falling back to Embedded MongoDB Server...`);
    }
  }

  // Fallback to MongoMemoryServer
  try {
    console.log('Initializing embedded MongoDB instance for zero-dependency local operation...');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`Embedded MongoDB Server Connected: ${memoryUri}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
