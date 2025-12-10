import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './database/connection.js';
import mapRoutes from './routes/map.route.js';
import raiderRoutes from './routes/raider.route.js';
import reportRoutes from './routes/report.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: 'http://localhost:4200',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/maps', mapRoutes);
app.use('/raiders', raiderRoutes);
app.use('/reports', reportRoutes);

await connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.status(204).send();
});

export default app;
