const Joi = require('joi');

//ge all resource and search validator
const getResourcesSchema = Joi.object({
    search: Joi.string().optional(), // Allow any search term
    type: Joi.string().valid("video", "audio", "pdf", "document", "video series").optional(), // Restrict to valid types
    state: Joi.string().valid("active", "inactive", "draft").optional(), // Ensure correct state
    categoryId: Joi.number().integer().optional(), // Ensure categoryId is a valid integer
});

//update resource validator
const updateResourceSchema = Joi.object({
    title: Joi.string().min(3).max(255).optional(),
    description: Joi.string().optional(),
    type: Joi.string().valid("video", "audio", "pdf").optional(),
    url: Joi.string().uri().optional(), // Ensure URL is valid
    tags: Joi.array().items(Joi.string()).optional(),
    state: Joi.string().valid("active", "inactive", "draft").optional(),
    isFeatured: Joi.boolean().optional(),
    size: Joi.number().positive().optional(), // Assuming size is numeric
    categoryId: Joi.number().integer().optional()
});

module.exports = 
    {
        getResourcesSchema,
        updateResourceSchema
    }