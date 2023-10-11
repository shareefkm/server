import { Server } from 'socket.io';

const initSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:4000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('deliveryStatusUpdate', ({ prodId, orderStatus }) => {
    // Broadcast the update to all connected clients
    io.emit('deliveryStatusUpdated', { prodId, orderStatus });
  });
  
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  return io;
};

export default initSocketIO;
