const express = require('express'); 
const mongoose = require('mongoose');
const dotenv= require('dotenv');

dotenv.config(); //load the .env file

const app = express(); //create the express application

app.use(express.json());

const authRoutes = require('./routes/auth'); //importing route files
app.use('/auth', authRoutes); // any request that starts with /auth is handed over to authRoutes

const protectedRoutes = require('./routes/protected');
app.use('/api', protectedRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err)=> console.log('Connection failed: ', err));

const PORT= process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})