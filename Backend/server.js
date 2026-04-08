import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { dbConnection } from './database/config.js';
import authRoutes from './routes/auth.js';
import clothesRoutes from './routes/clothes.js';
import tagsRoutes from './routes/tags.js'
import listsRoutes from './routes/lists.js'

dotenv.config({ path: '.env' });

const app = express();
const port = process.env.PORT;

dbConnection();

//cors
app.use(cors())

//body Parse
app.use( express.json() )

// Serve uploaded images
app.use("/images", express.static("public/images"));

//Endpoints
app.use('/api/auth', authRoutes)
app.use('/api/clothes', clothesRoutes)
app.use('/api/tags', tagsRoutes)
app.use('/api/lists', listsRoutes)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})