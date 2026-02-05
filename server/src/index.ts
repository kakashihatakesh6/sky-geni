import express from 'express';
import cors from 'cors';
import { loadData } from './data';
import { router } from './api';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  
  console.log(`📡 API HIT | ${req.method} ${req.url} | ${timestamp}`);
  next();
});


// Load data on startup
loadData();

// Routes
app.use('/api', router);

app.use('/', (req, res) => {
  res.send("server is running fine")
});
app.use('/health', (req, res) => {
  res.send("server health is okay!")
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
