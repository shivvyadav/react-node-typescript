// dotenv config
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

// custom modules
import { connectDB, disconnectDB } from './config/db';
import apiRateLimiter from './lib/express_rate_limit';

//apply cors middleware
import cors from 'cors';
app.use(
  cors({
    origin: '*',
    // origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // for bearer token
    credentials: true, // allow cookies
  }),
);

// enable json body parsing
app.use(express.json());

//enable urlencoded body parsing
app.use(express.urlencoded({ extended: true }));

// cookies parser
import cookieParser from 'cookie-parser';
app.use(cookieParser());

// for compression
import compression from 'compression';
app.use(
  compression({
    threshold: 1024, // only compress responses larger than 1kb
  }),
);

// set helmet for security
import helmet from 'helmet';
app.use(helmet());

// import and apply rate limiter middleware
app.use(apiRateLimiter);

// basic route
app.get('/', (request, response) => {
  return response.json({ message: 'Hello World!' });
});

// import routes
import authRoutes from './routes/auth.route';
app.use('/api/auth', authRoutes);

// connect to database
const port = process.env.PORT || 8000;
connectDB().then(() => {
  console.log('Database connected, starting server...');
  app.listen(port, () => console.log(`Server is running on port ${port}`));
});

// disconnect from database on app termination
const handleServerDown = async () => {
  try {
    await disconnectDB();
    console.log('SERVER TERMINATING...');
    process.exit(0);
  } catch (error) {
    console.error('Error during disconnection:', error);
  }
};

process.on('SIGINT', handleServerDown); // For Ctrl+C event
process.on('SIGTERM', handleServerDown); // For termination event
