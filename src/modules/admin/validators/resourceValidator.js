const Joi = require('joi');

//add category schema
const addCategorySchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).required(),
});

// create resource validator 
const addResourceSchema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(10).required(),
    tags: Joi.array().items(Joi.string()).default([]), 
    category_id: Joi.number().integer().required(),
    type: Joi.string().valid("video", "audio", "pdf", "document", "video series").required(),
    url: Joi.string().uri().required(),
    isFeatured: Joi.boolean().default(false),
    state: Joi.string().valid("active", "inactive", "draft").default("draft"),
});


//get all resource and search validator
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
    size: Joi.number().positive().optional(),
    categoryId: Joi.number().integer().optional()
});

module.exports = 
    {
        addCategorySchema,
        addResourceSchema,
        getResourcesSchema,
        updateResourceSchema
    }