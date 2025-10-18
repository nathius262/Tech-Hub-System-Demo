import db from '../../../models/index.cjs';
import {getPublicIdFromUrl} from '../../../utils/utils.js';
import cloudinary from '../../../config/cloudinaryConfig.js';



export const findAll = async ({limit, offset}) => {
  try {
    const {rows: courses, count: totalItems } = await db.Course.findAndCountAll({
      include: [{ model: db.Category, as: 'categories', attributes:['id', 'name'], through: { attributes: [] } }],
      limit,
      offset,
      distinct:true,
      order: [['createdAt', 'DESC'], ['updatedAt', 'DESC']],
    })
    return {
      courses,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    };
  } catch (error) {
   console.log(error)
    throw new Error('Error fetching records: ' + error.message);
  }
};

export const findById = async (id) => {
  try {
    const item = await db.Course.findByPk(id, {
      include: [{ model: db.Category, as: 'categories', attributes:['id', 'name'], through: { attributes: [] } }]
    });
    if (!item) throw new Error('Not found');
    return item;
  } catch (error) {
   console.log(error)
    throw new Error('Error fetching record: ' + error.message);
  }
};

export const create = async (data) => {
  try {
    return await db.Course.create(data);
  } catch (error) {
   console.log(error)
    throw new Error('Error creating record: ' + error.message);
  }
};

export const update = async (id, data) => {
  try {
    const item = await db.Course.findByPk(id);
    if (!item) throw new Error('Not found');

    if(data.image_url === undefined || data.image_url === null || data.image_url === '') {
      //remove image_url from data to prevent overwriting existing value with undefined
      data.image_url = item.image_url;
    }

    if (data.image_url && item.image_url && data.image_url !== item.image_url) {
      const publicId = getPublicIdFromUrl(item.image_url);
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.error('Error deleting image from Cloudinary:', cloudErr);
        throw new Error('Error deleting old image from Cloudinary: ' + cloudErr.message);
      }
    }



    return await item.update(data);
  } catch (error) {
   console.log(error)
    throw new Error('Error updating record: ' + error.message);
  }
};

export const destroy = async (id) => {
  try {
    const item = await db.Course.findByPk(id);
    if (!item) throw new Error('Not found');

    if (item.image_url) {
      const publicId = getPublicIdFromUrl(item.image_url);
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.error('Error deleting image from Cloudinary:', cloudErr);
        throw new Error('Error deleting image from Cloudinary: ' + cloudErr.message);
      }
    }
    
    return await item.destroy();
  } catch (error) {
   console.log(error)
    throw new Error('Error deleting record: ' + error.message);
  }
};

// Additional service methods can be added here as needed
//total course count
export const countCourses = async () => {
  try {
    const totalItems = await db.Course.count();
    return totalItems;
  } catch (error) {
   console.log(error)
    throw new Error('Error counting records: ' + error.message);
  }
};