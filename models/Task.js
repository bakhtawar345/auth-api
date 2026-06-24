const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['pending', 'in-process', 'done'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        //storing a reference to the actual User in MongoDB
        ref: 'User',
        // tells mongoose this id belongs to a use document 
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        default: null
    },
    file: {
        type: String,
        default: null
    }
}, { timestamps: true} ); 
//adds to feilds to every task: createdAt and updatedAt

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;