const Task = require('../models/Task');

exports.getAllTasks = async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find();
    } else {
      tasks = await Task.find({ userId: req.user._id });
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      userId: req.user._id,
      ...req.body
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    let task;
    if (req.user.role === 'admin') {
      task = await Task.findById(req.params.id);
    } else {
      task = await Task.findOne({ 
        _id: req.params.id, 
        userId: req.user._id 
      });
    }

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    let task;
    if (req.user.role === 'admin') {
      task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    } else {
      task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        req.body,
        { new: true }
      );
    }

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    let task;
    if (req.user.role === 'admin') {
      task = await Task.findByIdAndDelete(req.params.id);
    } else {
      task = await Task.findOneAndDelete({ 
        _id: req.params.id, 
        userId: req.user._id 
      });
    }

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};