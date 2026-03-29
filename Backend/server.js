import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { dbConnection } from './database/config.js';
import authRoutes from './routes/auth.js';

dotenv.config({ path: '.env' });

const app = express();
const port = process.env.PORT;

dbConnection();

//cors
app.use(cors())

//body Parse
app.use( express.json() )

//Endpoints
app.use('/api/auth', authRoutes)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})