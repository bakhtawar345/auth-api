const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create a task - any logged in user
router.post('/', verifyToken, async (req, res) => {
    const { title, description } = req.body;

    const newTask = new Task({
        title,
        description,
        createdBy: req.user.userId
    });

    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', newTask });
});

// Get all tasks - admin sees all, user sees own + assigned
router.get('/', verifyToken, async (req, res) => {
    let tasks;

    if (req.user.role === 'admin') {
        tasks = await Task.find()
            .populate('createdBy', 'username')
            .populate('assignedTo', 'username');
    } else {
        tasks = await Task.find({
            $or: [
                { createdBy: req.user.userId },
                { assignedTo: req.user.userId }
            ]
        })
            .populate('createdBy', 'username')
            .populate('assignedTo', 'username');
    }

    res.status(200).json(tasks);
});

// Get one task
router.get('/:id', verifyToken, async (req, res) => {
    const task = await Task.findById(req.params.id)
        .populate('createdBy', 'username')
        .populate('assignedTo', 'username');

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
});

// Update a task
router.put('/:id', verifyToken, async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin' && task.createdBy.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Access denied. You can only edit your own tasks.' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'Task updated successfully', updatedTask });
});

// Delete a task - admin only
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
});

// Assign a task to a user
router.post('/:id/assign', verifyToken, async (req, res) => {
    const { userId } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    task.assignedTo = userId;
    await task.save();

    res.status(200).json({ message: 'Task assigned successfully', task });
});

// Upload a file to a task
router.post('/:id/upload', verifyToken, upload.single('file'), async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    task.file = req.file.path;
    await task.save();

    res.status(200).json({ message: 'File uploaded successfully', task });
});

module.exports = router;