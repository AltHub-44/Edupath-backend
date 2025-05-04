const Resource = require('../../../models/resourceModel');
const ResourceAssignment = require('../../../models/resourceAssignmentModel');
const User = require('../../../models/userModel');
const { error } = require('../../../utils/helpers');
const { Op } = require('sequelize');

const createResource = async (mentorId, resourceData) => {
    try {
        const resource = await Resource.create({
            ...resourceData,
            mentorId
        });

        return resource;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const getResources = async (mentorId, filters = {}) => {
    try {
        const resources = await Resource.findAll({
            where: { mentorId, ...filters },
            order: [['createdAt', 'DESC']]
        });

        return resources;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const getResourceById = async (mentorId, resourceId) => {
    try {
        const resource = await Resource.findOne({
            where: { id: resourceId, mentorId }
        });

        if (!resource) {
            error(404, 'Resource not found');
        }

        return resource;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const updateResource = async (mentorId, resourceId, updateData) => {
    try {
        const resource = await Resource.findOne({
            where: { id: resourceId, mentorId }
        });

        if (!resource) {
            error(404, 'Resource not found');
        }

        await resource.update(updateData);
        return resource;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const deleteResource = async (mentorId, resourceId) => {
    try {
        const resource = await Resource.findOne({
            where: { id: resourceId, mentorId }
        });

        if (!resource) {
            error(404, 'Resource not found');
        }

        await resource.destroy();
        return { message: 'Resource deleted successfully' };
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const assignResource = async (mentorId, resourceId, assignmentData) => {
    try {
        // Verify the resource exists and belongs to the mentor
        const resource = await Resource.findOne({
            where: { id: resourceId, mentorId }
        });

        if (!resource) {
            error(404, 'Resource not found');
        }

        // Verify the student is assigned to this mentor
        const relationship = await StudentMentor.findOne({
            where: { mentorId, studentId: assignmentData.studentId }
        });

        if (!relationship) {
            error(404, 'Student not found or not assigned to this mentor');
        }

        const assignment = await ResourceAssignment.create({
            resourceId,
            studentId: assignmentData.studentId,
            mentorId,
            dueDate: assignmentData.dueDate,
            notes: assignmentData.notes
        });

        return assignment;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const getResourceAssignments = async (mentorId, resourceId) => {
    try {
        const assignments = await ResourceAssignment.findAll({
            where: { mentorId, resourceId },
            include: [{
                model: User,
                as: 'student',
                attributes: ['id', 'firstName', 'lastName', 'email']
            }]
        });

        return assignments;
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

const getResourceStatistics = async (mentorId) => {
    try {
        const totalResources = await Resource.count({ where: { mentorId } });
        const publicResources = await Resource.count({ 
            where: { 
                mentorId,
                isPublic: true
            }
        });

        const resourceTypes = await Resource.findAll({
            where: { mentorId },
            attributes: [
                'type',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['type']
        });

        const mostViewed = await Resource.findAll({
            where: { mentorId },
            order: [['viewCount', 'DESC']],
            limit: 5
        });

        return {
            totalResources,
            publicResources,
            resourceTypes,
            mostViewed
        };
    } catch (err) {
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
};

module.exports = {
    createResource,
    getResources,
    getResourceById,
    updateResource,
    deleteResource,
    assignResource,
    getResourceAssignments,
    getResourceStatistics
}; 