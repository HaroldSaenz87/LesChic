import express from 'express'
import dotenv from 'dotenv';

import { dbConnection } from './database/config.js';
import authRoutes from './routes/auth.js';
import clothesRoutes from './routes/clothes.js';

dotenv.config({ path: '.env' });

const app = express();
const port = process.env.PORT;

dbConnection();

//body Parse
app.use( express.json() )

//Endpoints
app.use('/api/auth', authRoutes)
app.use('/api/clothes', clothesRoutes)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})