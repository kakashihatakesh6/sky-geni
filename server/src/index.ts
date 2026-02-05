import express from 'express';
import cors from 'cors';
import { loadData } from './data';
import { router } from './api';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Load data on startup
loadData();

// Routes
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
