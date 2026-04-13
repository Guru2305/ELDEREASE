import express from 'express';
import jwt from 'jsonwebtoken';
import { connectToDatabase, toObjectId } from '../utils/db.js';

const router = express.Router();

// Middleware to authenticate user
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Find user
    const user = await db.collection('users').findOne({ _id: toObjectId(decoded.id) });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    req.user = user;
    req.db = db;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Apply authentication middleware to all routes
router.use(authenticate);

// @desc    Create a new task (Elder request)
// @route   POST /api/tasks
// @access  Private (Elder only)
router.post('/', async (req, res) => {
  try {
    const { title, description, urgency } = req.body;
    const user = req.user;
    const db = req.db;

    // Check if user is an elder
    if (user.role !== 'elder') {
      return res.status(403).json({
        success: false,
        message: 'Only elders can create tasks'
      });
    }

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    // Create task document
    const taskDoc = {
      elderId: user._id,
      elderName: `${user.firstName} ${user.lastName}`,
      title: title.trim(),
      description: description.trim(),
      urgency: urgency || 'medium',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert task
    const result = await db.collection('tasks').insertOne(taskDoc);
    const taskId = result.insertedId;

    // Return created task
    const taskResponse = {
      _id: taskId,
      elderId: user._id,
      elderName: taskDoc.elderName,
      title: taskDoc.title,
      description: taskDoc.description,
      urgency: taskDoc.urgency,
      status: taskDoc.status,
      createdAt: taskDoc.createdAt,
      updatedAt: taskDoc.updatedAt
    };

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: {
        task: taskResponse
      }
    });

  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get available tasks (Volunteer feed)
// @route   GET /api/tasks/available
// @access  Private (Volunteer only)
router.get('/available', async (req, res) => {
  try {
    const user = req.user;
    const db = req.db;

    // Check if user is a volunteer
    if (user.role !== 'volunteer') {
      return res.status(403).json({
        success: false,
        message: 'Only volunteers can view available tasks'
      });
    }

    // Find all pending tasks
    const tasks = await db.collection('tasks')
      .find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      data: {
        tasks: tasks.map(task => ({
          _id: task._id,
          elderId: task.elderId,
          elderName: task.elderName,
          title: task.title,
          description: task.description,
          urgency: task.urgency,
          status: task.status,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt
        }))
      }
    });

  } catch (error) {
    console.error('Get available tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching available tasks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Accept a task (Volunteer action)
// @route   PUT /api/tasks/accept/:taskId
// @access  Private (Volunteer only)
router.put('/accept/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const user = req.user;
    const db = req.db;

    // Check if user is a volunteer
    if (user.role !== 'volunteer') {
      return res.status(403).json({
        success: false,
        message: 'Only volunteers can accept tasks'
      });
    }

    // Validate taskId
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: 'Task ID is required'
      });
    }

    // Update task
    const result = await db.collection('tasks').updateOne(
      { 
        _id: toObjectId(taskId),
        status: 'pending'
      },
      {
        $set: {
          volunteerId: user._id,
          volunteerName: `${user.firstName} ${user.lastName}`,
          status: 'accepted',
          acceptedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or already accepted'
      });
    }

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task could not be updated'
      });
    }

    // Get updated task
    const updatedTask = await db.collection('tasks').findOne({ _id: toObjectId(taskId) });

    res.status(200).json({
      success: true,
      message: 'Task accepted successfully',
      data: {
        task: {
          _id: updatedTask._id,
          elderId: updatedTask.elderId,
          elderName: updatedTask.elderName,
          title: updatedTask.title,
          description: updatedTask.description,
          urgency: updatedTask.urgency,
          status: updatedTask.status,
          volunteerId: updatedTask.volunteerId,
          volunteerName: updatedTask.volunteerName,
          acceptedAt: updatedTask.acceptedAt,
          createdAt: updatedTask.createdAt,
          updatedAt: updatedTask.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Accept task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error accepting task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get user's tasks (Elder or Volunteer)
// @route   GET /api/tasks/my-tasks
// @access  Private
router.get('/my-tasks', async (req, res) => {
  try {
    const user = req.user;
    const db = req.db;

    let query = {};
    if (user.role === 'elder') {
      query.elderId = user._id;
    } else if (user.role === 'volunteer') {
      query.volunteerId = user._id;
    }

    const tasks = await db.collection('tasks')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      data: {
        tasks: tasks.map(task => ({
          _id: task._id,
          elderId: task.elderId,
          elderName: task.elderName,
          title: task.title,
          description: task.description,
          urgency: task.urgency,
          status: task.status,
          volunteerId: task.volunteerId,
          volunteerName: task.volunteerName,
          acceptedAt: task.acceptedAt,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt
        }))
      }
    });

  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching tasks',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
