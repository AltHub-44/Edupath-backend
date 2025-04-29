const Resource = require('../../../models/resourceModel');
const ResourceVersion = require('../../../models/resourceVersionModel');
const ResourceShare = require('../../../models/resourceShareModel');
const ResourceCollection = require('../../../models/resourceCollectionModel');
const { Op } = require('sequelize');

// Create a new resource
exports.createResource = async (req, res) => {
    try {
        const { title, description, type, content, url, tags, isPublic, isTemplate, collectionId } = req.body;
        const mentorId = req.user.id;

        const resource = await Resource.create({
            title,
            description,
            type,
            content,
            url,
            tags,
            isPublic,
            isTemplate,
            collectionId,
            mentorId
        });

        // Create initial version
        await ResourceVersion.create({
            resourceId: resource.id,
            version: 1,
            title,
            description,
            content,
            url,
            createdBy: mentorId
        });

        res.status(201).json({
            success: true,
            data: resource
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all resources for a mentor
exports.getResources = async (req, res) => {
    try {
        const mentorId = req.user.id;
        const { type, status, collectionId, search } = req.query;

        const where = { mentorId };
        if (type) where.type = type;
        if (status) where.status = status;
        if (collectionId) where.collectionId = collectionId;
        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
                { tags: { [Op.contains]: [search] } }
            ];
        }

        const resources = await Resource.findAll({
            where,
            include: [
                {
                    model: ResourceCollection,
                    as: 'collection'
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: resources
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single resource
exports.getResource = async (req, res) => {
    try {
        const { id } = req.params;
        const mentorId = req.user.id;

        const resource = await Resource.findOne({
            where: {
                id,
                [Op.or]: [
                    { mentorId },
                    { isPublic: true }
                ]
            },
            include: [
                {
                    model: ResourceCollection,
                    as: 'collection'
                },
                {
                    model: ResourceVersion,
                    as: 'versions',
                    order: [['version', 'DESC']]
                }
            ]
        });

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        res.json({
            success: true,
            data: resource
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a resource
exports.updateResource = async (req, res) => {
    try {
        const { id } = req.params;
        const mentorId = req.user.id;
        const updates = req.body;

        const resource = await Resource.findOne({
            where: { id, mentorId }
        });

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        // Create new version if content or description changed
        if (updates.content || updates.description || updates.title) {
            const newVersion = resource.version + 1;
            await ResourceVersion.create({
                resourceId: id,
                version: newVersion,
                title: updates.title || resource.title,
                description: updates.description || resource.description,
                content: updates.content || resource.content,
                url: updates.url || resource.url,
                changes: updates.changes || 'Updated resource',
                createdBy: mentorId
            });
            updates.version = newVersion;
        }

        await resource.update(updates);

        res.json({
            success: true,
            data: resource
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a resource
exports.deleteResource = async (req, res) => {
    try {
        const { id } = req.params;
        const mentorId = req.user.id;

        const resource = await Resource.findOne({
            where: { id, mentorId }
        });

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        await resource.destroy();

        res.json({
            success: true,
            message: 'Resource deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Share a resource
exports.shareResource = async (req, res) => {
    try {
        const { id } = req.params;
        const mentorId = req.user.id;
        const { sharedWith, permission, message, expiresAt } = req.body;

        const resource = await Resource.findOne({
            where: { id, mentorId }
        });

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        const share = await ResourceShare.create({
            resourceId: id,
            sharedBy: mentorId,
            sharedWith,
            permission,
            message,
            expiresAt
        });

        res.status(201).json({
            success: true,
            data: share
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get shared resources
exports.getSharedResources = async (req, res) => {
    try {
        const mentorId = req.user.id;

        const shares = await ResourceShare.findAll({
            where: {
                [Op.or]: [
                    { sharedBy: mentorId },
                    { sharedWith: mentorId }
                ],
                status: 'accepted'
            },
            include: [
                {
                    model: Resource,
                    as: 'resource'
                }
            ]
        });

        res.json({
            success: true,
            data: shares
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update share status
exports.updateShareStatus = async (req, res) => {
    try {
        const { shareId } = req.params;
        const mentorId = req.user.id;
        const { status } = req.body;

        const share = await ResourceShare.findOne({
            where: {
                id: shareId,
                sharedWith: mentorId
            }
        });

        if (!share) {
            return res.status(404).json({
                success: false,
                message: 'Share not found'
            });
        }

        await share.update({ status });

        res.json({
            success: true,
            data: share
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get resource versions
exports.getResourceVersions = async (req, res) => {
    try {
        const { id } = req.params;
        const mentorId = req.user.id;

        const resource = await Resource.findOne({
            where: { id, mentorId }
        });

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        const versions = await ResourceVersion.findAll({
            where: { resourceId: id },
            order: [['version', 'DESC']]
        });

        res.json({
            success: true,
            data: versions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Restore a specific version
exports.restoreVersion = async (req, res) => {
    try {
        const { id, versionId } = req.params;
        const mentorId = req.user.id;

        const resource = await Resource.findOne({
            where: { id, mentorId }
        });

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: 'Resource not found'
            });
        }

        const version = await ResourceVersion.findOne({
            where: { id: versionId, resourceId: id }
        });

        if (!version) {
            return res.status(404).json({
                success: false,
                message: 'Version not found'
            });
        }

        // Create new version with restored content
        const newVersion = resource.version + 1;
        await ResourceVersion.create({
            resourceId: id,
            version: newVersion,
            title: version.title,
            description: version.description,
            content: version.content,
            url: version.url,
            changes: `Restored from version ${version.version}`,
            createdBy: mentorId
        });

        await resource.update({
            title: version.title,
            description: version.description,
            content: version.content,
            url: version.url,
            version: newVersion
        });

        res.json({
            success: true,
            message: 'Version restored successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}; 