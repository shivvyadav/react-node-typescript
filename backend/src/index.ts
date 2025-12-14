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
