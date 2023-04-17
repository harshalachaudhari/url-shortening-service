import app from './app';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const port = process.env.PORT || 3000;
mongoose
    .connect(process.env.DB_URL || 'mongodb://localhost:27017')
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));
app.listen(port, () => console.log(`Server is listening on PORT ${port}`));