const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

// Get all todos for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching todos' });
  }
});

// Create a new todo
router.post('/', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    const todo = new Todo({
      text,
      user: req.user.id
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Error creating todo' });
  }
});

// Update a todo
router.put('/:id', auth, async (req, res) => {
  try {
    const { text, completed } = req.body;
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (text !== undefined) todo.text = text;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Error updating todo' });
  }
});

// Delete a todo
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting todo' });
  }
});

module.exports = router;
