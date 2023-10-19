import { Server } from 'socket.io';

const initSocketIO = (server) => {
  
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:4000/',
      methods: ['GET', 'POST'],
    },
  });

  io.on("connection", (socket) => {

    socket.on('join', name=> {
      console.log('hiee')
    })
    socket.on('chat message', (message) => {
      io.emit('chat message', message);
    });
  
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  return io;
};

export default initSocketIO;
