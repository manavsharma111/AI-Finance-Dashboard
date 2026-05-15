import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import connectDB from './config/db.js'
import userRouter from './routes/userRoute.js'
import incomeRouter from './routes/incomeRoute.js'
import expanseRouter from './routes/expanseRoutes.js'
import dashBoardRouter from './routes/dashboardRoute.js'
import aiRouter from './routes/aiRoute.js'

const app = express();
const port = process.env.PORT;

// Middleware

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/user", userRouter)
app.use("/api/income", incomeRouter)
app.use("/api/expense", expanseRouter)
app.use("/api/dashboard", dashBoardRouter)
app.use("/api/ai", aiRouter)

// DB and Server
const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
