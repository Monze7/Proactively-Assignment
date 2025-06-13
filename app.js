import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectRedis } from './config/redis.js';
import adminRoutes from './routes/admin.js';
import { setupFormSockets } from './sockets/formSockets.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(express.json());
app.use('/admin', adminRoutes);

connectRedis();

setupFormSockets(io);

httpServer.listen(3000, () => {
  console.log('Server running on port 3000');
});
