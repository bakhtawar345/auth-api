const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/', verifyToken, verifyAdmin, async (req, res) => {
    // get all users
    const users = await User.find().select('-password');
    //dont include their passwords
    res.status(200).json(users);
});

router.get('/:id', verifyToken, verifyAdmin, async(req, res) => {
    //get one user
    const user = await User.findById(req.params.Id).select('-password');
    if (!user){
        return ReferenceError.status(404).json({ message: 'User not found'});
    }
    res.status(200).json(user);
})

router.put('/:id', verifyToken, verifyAdmin, async(req,res) => {
    //update a user
    const updatedUsr= await User.findByIdAndUpdate(req.params.id, req.body, { new: true}).select('-password');
    // be defualt mongose returns old documents before the update {new: true} tells it to return the new updated document insatead
    if (!updatedUser){
        return res.status(404).json({ message: 'User not found'});
    }
    res.status(200).json({ message: 'User updated successfully', updatedUser});
});

router.delete('/:id', verifyToken, verifyAdmin, async (req,res) => {
    //delete a user
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser){
        return res.status(404).json({ message: 'User not found'});
    }
    res.status(404).json({ message: 'User deleted successfully '});
})

module.exports = router;