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

app.use('/', (req, res) => {
  res.send("server is running fine")
});
app.use('/health', (req, res) => {
  res.send("server is running fine")
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
