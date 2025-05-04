const { DataTypes } = require('sequelize');
const sequelize = require('../../../database/db');
const { Op } = require('sequelize');

const Progress = sequelize.define('Progress', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    milestone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
        defaultValue: 'pending'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    completionDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    metrics: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
            assignmentsCompleted: 0,
            sessionsAttended: 0,
            averageGrade: 0,
            lastUpdated: null
        }
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['studentId']
        },
        {
            fields: ['status']
        }
    ]
});

// Create a new progress milestone
const createProgress = async (req, res) => {
  try {
    const { studentId, milestone, description, notes } = req.body;
    
    const progress = await Progress.create({
      studentId,
      milestone,
      description,
      notes,
      createdBy: req.user.id
    });

    return res.status(201).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error creating progress:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create progress milestone'
    });
  }
};

// Get all progress for a student
const getStudentProgress = async (req, res) => {
  try {
    const { studentId } = req.params;

    const progress = await Progress.findAll({
      where: { studentId },
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error fetching student progress:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch student progress'
    });
  }
};

// Update progress status
const updateProgressStatus = async (req, res) => {
  try {
    const { progressId } = req.params;
    const { status, notes } = req.body;

    const progress = await Progress.findByPk(progressId);
    if (!progress) {
      return res.status(404).json({
        success: false,
        message: 'Progress milestone not found'
      });
    }

    await progress.update({
      status,
      notes,
      completionDate: status === 'completed' ? new Date() : null
    });

    return res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update progress'
    });
  }
};

// Get progress metrics for a student
const getProgressMetrics = async (req, res) => {
  try {
    const { studentId } = req.params;

    const totalMilestones = await Progress.count({
      where: { studentId }
    });

    const completedMilestones = await Progress.count({
      where: {
        studentId,
        status: 'completed'
      }
    });

    const inProgressMilestones = await Progress.count({
      where: {
        studentId,
        status: 'in_progress'
      }
    });

    const pendingMilestones = await Progress.count({
      where: {
        studentId,
        status: 'pending'
      }
    });

    const completionRate = totalMilestones > 0 
      ? (completedMilestones / totalMilestones) * 100 
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalMilestones,
        completedMilestones,
        inProgressMilestones,
        pendingMilestones,
        completionRate
      }
    });
  } catch (error) {
    console.error('Error fetching progress metrics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch progress metrics'
    });
  }
};

module.exports = {
  createProgress,
  getStudentProgress,
  updateProgressStatus,
  getProgressMetrics
}; 