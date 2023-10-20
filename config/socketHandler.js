// import { Server } from 'socket.io';

// const initSocketIO = (server) => {
  
//   const io = new Server(server, {
//     cors: {
//       origin: 'http://localhost:4000/',
//       methods: ['GET', 'POST'],
//     },
//   });

//   io.on("connection", (socket) => {
// console.log('user joined',socket.id)
//     socket.on('join', name=> {
//       console.log('hiee')
//     })
//     socket.on('send message', (messages) => {
//       console.log(messages);
//       io.emit('send message', messages);
//     });
  
//     socket.on('disconnect', () => {
//       console.log('A user disconnected');
//     });
//   });

//   return io;
// };

// export default initSocketIO;
