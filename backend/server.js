import express from 'express';
import dotenv from 'dotenv';
import qrRoutes from './routes/qrRoutes.js';

dotenv.config();

const app = express();

// Parse incoming JSON requests
app.use(express.json());

// Routes
app.use('/api/qr', qrRoutes);


const startServer = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
