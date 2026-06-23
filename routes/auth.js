const jwt = require('jsonwebtoken')
const express = require('express');
const router = express.Router(); //mini appp object
const User = require('../models/User'); //User model

router.post('/signup', async(req, res) => { // req is incoming requests, res is what is sent back
    const { username, password, role} = req.body; //garb the username and password from wtv the user sends
    
    const existingUser = await User.findOne({ username});
    if (existingUser){
        return res.status(400).json({ message: 'Username already exists'})
    }

    const newUser = new User ({ username, password, role });
    await newUser.save(); //save it to MongoDB

    res.status(201).json({ message: 'User created successfully '});
});

router.post('/login', async(req,res)=> {
    const { username, password } = req.body;

    const user =  await User.findOne ({ username});
    if (!user) {
        res.status(404).json({ message: 'User not found'});
    }
    if (user.password !== password){
        return res.status(400).json({message: 'Incorrent password'});
    }

    const token = jwt.sign(
        { userId: user._id, role: user.role},
        process.env.JWT_SECRET,
        { expiresIn: '24h'}
    )

    res.status(200).json({ message: 'Login succesful', token})
})

module.exports = router;