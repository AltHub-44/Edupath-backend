const ResourceCategory = require('../../../models/resourceCategory')
const Resource = require('../../../models/resource')
const { error } = require('../../../utils/helpers')
//create resource category
const createCategory = async ({name, description}) => {
    try{
        const existingCategory = await ResourceCategory.findOne({ where: { name }})
        if(existingCategory) error(401, 'Category already exist')

        const newCategory = await ResourceCategory.create({
            name,
            description
        });

        if(!newCategory) error(400, 'Unable to create category')

        return newCategory

    }
    catch(err){
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
}

//get categories
const getCategory = async () => {
    try{
        const categories = await ResourceCategory.findAll()

        return categories

    }
    catch(err){
        error(err.statusCode || 500, err.message || 'Internal server error')
    }
}
//add Resources

const addResource = async ({ title, description, tags, url, type, category_id, state, isFeatured}) => {
    try{
        const existingResource = await Resource.findOne({ where: { title }})
        if(existingResource) error(401, 'A resource with the same title already exist')
        
        const newResource = await Resource.create({
            title,
            description,
            tags,
            url,
            type,
            state,
            isFeatured,
            categoryId: category_id,
        });
        if(!newResource) error(400, 'Unableto create resource,please try again later');

        return newResource;
    }
    catch(err){
        error(err.statusCode || 500, err.message || 'Internal server error');
    }

}

//get resources
const getResources = async ({ search, type, state, categoryId, page = 1, perPage =  10 }) => {
    try{
        const where = {}
        if(search){
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ]
        }
        if(type) where.type = type;
        if(state) where.state = state;
        if(categoryId) where.categoryId = categoryId 

    const sortOption = [
            ['isFeatured', 'DESC'],  // Featured properties come first
            ['createdAt', 'DESC']     // Then sort by newest first
          ];

          // Pagination
    const limit = parseInt(perPage, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    const resources = await Resource.findAndCountAll({
        where,
        include: [
            {
                model: ResourceCategory,
                as: "category",
                attributes: ["id", "name"]
            }
        ],
        order: sortOption,
        limit,
        offset,
    });

    if (!resources.rows.length) {
        error(404, 'No resource found');
      }
  
      const response =  {
        total: resources.count,
        page: parseInt(page, 10),
        perPage: limit,
        totalPages: Math.ceil(resources.count / limit),
        resources: resources.rows,
      };

      return response




        // const resources = await Resource.findAll({
        //     include: [{
        //         model: ResourceCategory,
        //         as: "category",
        //         attributes: ["id", "name"] // Ensure only relevant attributes are fetched
        // }]
        // });
        // if(!resources) error(404, 'No resource found');

        // return resources;
    }
    catch(err){
        error(err.statusCode || 500, err.message || 'Internal server error');
    }
    
}

//update resources

//delete resources

module.exports = {
    createCategory,
    getCategory,
    addResource,
    getResources,
    // getSingleResources 
    // updateResources,
    // deleteResources
}