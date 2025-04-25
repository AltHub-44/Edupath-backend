const db = require('../database/db');
const { DataTypes } = require('sequelize');
const User = require('./userModel');

const MentorProfile = db.define('MentorProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  expertise: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  socialMedia: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      linkedin: null,
      twitter: null,
      github: null
    }
  },
  contactInfo: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      phone: null,
      email: null
    }
  },
  timeZone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  maxMenteesPerSession: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  sessionDuration: {
    type: DataTypes.INTEGER, // in minutes
    defaultValue: 60
  },
  availability: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    }
  },
  privacySettings: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      showEmail: false,
      showPhone: false,
      allowMessagesFromAll: false
    }
  },
  notificationSettings: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {
      email: {
        newMentee: true,
        sessionRequest: true,
        assignmentSubmitted: true,
        messageReceived: true
      },
      push: {
        newMentee: true,
        sessionRequest: true,
        assignmentSubmitted: true,
        messageReceived: true
      }
    }
  },
  profileCompletion: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  languages: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true
  },
  education: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  experience: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  certifications: {
    type: DataTypes.JSONB,
    allowNull: true
  }
});

// Define associations
MentorProfile.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(MentorProfile, { foreignKey: 'userId' });

module.exports = MentorProfile; 