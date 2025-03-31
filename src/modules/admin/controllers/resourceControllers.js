const resourceServices = require('../services/resourceServices')
//add resource category
const addNew = async (req, res) => {
    const { name, description } = req.body
    try{
        const addCategory = await resourceServices.createCategory({name, description})
        res.status(201).json({ success: true, message: 'category added successfully', data: addCategory })
    }
    catch(err){
        res.status(err.statusCode).json({ success: false, message: err.message})
    }

}

//get all category
const getAll = async (req, res) => {
    try{
        const allCategories = await resourceServices.getCategory()
        if(!allCategories) error(404, 'No categories found')

        res.status(200).json({ success: true, message: 'all categories fetched', data: allCategories });

    }
    catch(err){
        res.status(err.statusCode || 500).json({ success: false, message: err.message });
    }
}

//add resources
const addResource = async (req, res) =>{
    const { title, description, tags, category_id, type, url, isFeatured, state } = req.body;
    try{
        const createResource = await resourceServices.addResource({ title, description, tags, url, type, category_id, state, isFeatured})
        res.status(201).json({ success: true, message: "resource created successfully", data: createResource})
    }
    catch(err){
        res.status(err.statusCode).json({ success: false, message: err.message });
    }

}

//get all resources with search and pagination
const getAllResources = async (req, res) => {
    try {
        const { search, type, state, categoryId } = req.query
        const resources = await resourceServices.getResources({ search, type, state, categoryId })

        res.status(200).json({ success: true, message: "all resource fetched successfully", data: resources})
    } catch (err) {
        res.status(err.statusCode).json({ success: false, message: err.message });
    }
}

//get Single resource
const getSingleResource = async(req, res) => {
    try{
        const id = req.params.id;
        const resource = await resourceServices.getSingleResource(id);

        res.status(200).json( { success: true, message: 'Resource fetched successfully', data: resource });
    }
    catch(err){
        res.status(err.statusCode).json({ success: false, message: err.message });
    }
} 

//update resource
const updateSingleResource = async (req, res) => {
    try{
        const id = req.params.id;
        const { title, description, type,
            url, tags, state, isFeatured, size, categoryId } = req.body

         const updatedResource = await resourceServices.updateResource({ id, title, description, type,
            url, tags, state, isFeatured, size, categoryId });
        
        res.status(200).json({ success: true, message: 'property updated successfully', data: updatedResource });

    }
    catch(err){
        res.status(err.statusCode).json({ success: false, message: err.message });
    }
}


//delete resource
const deleteResource = async (req, res) => {
    const id = req.params.id;
    try{
         await resourceServices.deleteResources(id);

        res.status(200).json({ success: true, messsage: 'Item deleted successfully' });
    }
    catch(err){
        res.status(err.statusCode).json({ success: false, message: err.message });
    }
}

module.exports = {
    addNew,
    getAll,
    addResource,
    getAllResources,
    getSingleResource,
    updateSingleResource,
    deleteResource

}