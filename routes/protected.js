const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/view', verifyToken, (req, res)=> {
    res.status(200).json({ message:`Welcome ${req.user.role}! Here is your data.`} )
}); // fetching data, not sending any

router.post('/add', verifyToken, (req,res) => {
    res.status(200).json({ message: 'Item added successfully'});
});

router.put('/edit', verifyToken, (req,res)=> {
    res.status(200).json({ message:'Item edited succesfully'}); //updating exisiting data
});

router.delete('/delete', verifyToken, verifyAdmin, (req, res)=> {
    res.status(200).json({ message: 'Item deleted successfully'});
}); //removing data

module.exports = router;