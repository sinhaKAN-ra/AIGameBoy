import cors from 'cors';

// Configure CORS for production and development environments
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://aigameboy.replit.app', 'https://aigameboy.vercel.app', 'https://aigameboy.space'] // Production frontend URLs
    : ['http://localhost:5173', 'http://localhost:3000'], // Development frontend URLs
  credentials: true, // Allow cookies for authenticated requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export const corsMiddleware = cors(corsOptions);
