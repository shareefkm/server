// //imports packages
// import express from "express"
// import dotenv from "dotenv"
// import cors from "cors"
// import morgan from "morgan"

// //imports files
// import connectDB from "./config/db.js"
// import userRouter from "./routes/user.js"
// import adminRouter from "./routes/admin.js"
// import restaurantRouter from "./routes/restaurant.js"
// import employeeRouter from "./routes/employee.js"

// //Dotenv config
// dotenv.config()

// //mongodb connection
// connectDB()

// const app = express()

// //middlewares
// app.use(express.json({limit : "10mb"}))
// app.use(cors())
// app.use(morgan('dev'))

// app.use('/',userRouter)
// app.use('/admin',adminRouter)
// app.use('/restaurant',restaurantRouter)
// app.use('/employee',employeeRouter)

// //port
// const PORT = process.env.PORT

// app.listen(PORT,()=>{
//     console.log(`server connected ${PORT}`);
// })

import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
// import morgan from 'morgan';
import connectDB from "./config/db.js";
import initSocketIO from './config/socketHandler.js';

// Import your routers
import userRouter from './routes/user.js';
import adminRouter from './routes/admin.js';
import restaurantRouter from './routes/restaurant.js';
import employeeRouter from './routes/employee.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware setup
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  // app.use(morgan('dev'));

  // Routers
  app.use('/', userRouter);
  app.use('/admin', adminRouter);
  app.use('/restaurant', restaurantRouter);
  app.use('/employee', employeeRouter);

  // Initialize Socket.io handling
  const io = initSocketIO(server);

  const PORT = process.env.PORT || 4010

  io.emit('connection', () => {
    console.log('Socket.io is connected');
  });

  server.listen(PORT, () => {
    console.log(`Server connected on port ${PORT}`);
  });
