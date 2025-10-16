import * as service from '../services/admin.Course.service.js';
import * as categoryService from '../../category/services/admin.Category.service.js';

export const findAll = async (req, res) => {
  const {page, limit, offset} = req.pagination
  try {
    const data = await service.findAll({limit, offset});
    res.status(200).render('./admins/course_list', {
      success: true,
      layout: "admin",
      pageTitle: "Admin",
      courses: data.courses,
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      currentPage: page
    });
  } catch (err) {
  console.log(err)
    res.status(500).render('errors/500', { error: err });
  }
};

export const findById = async (req, res) => {
  try {
    const data = await service.findById(req.params.id);
    const categories = await categoryService.findAll({limit: 100, offset: 0});

    res.status(200).render('./admins/course_update', {
      success: true,
      layout: "admin",
      pageTitle: "Update Record",
      course: data,
      categories: categories.categories
    });
  } catch (err) {
  console.log(err)
    res.status(404).render('errors/404', { error: err });
  }
};

export const create = async (req, res) => {
  try {

    //get request files
    const files = req.files;
    if (files && files.length > 0) {
      //assuming only one file is uploaded
      const imageFile = files[0];
      //set the image_url field to the path of the uploaded file
      req.body.image_url = imageFile.path;
    }

    const data = await service.create(req.body);

    data.setCategories(req.body.category_id);

    res.status(201).json({ success: true, message: 'Created successfully', redirectTo: '/admin/course', data });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const update = async (req, res) => {
  try {

    //get request files
    const files = req.files;
    if (files && files.length > 0) {
      //assuming only one file is uploaded
      const imageFile = files[0];
      //set the image_url field to the path of the uploaded file
      req.body.image_url = imageFile.path;
    }
    
    const data = await service.update(req.params.id, req.body);

    //data.removeCategories();

    data.setCategories(req.body.category_id);
    res.status(200).json({ success: true, message: 'Updated successfully', redirectTo: '/admin/course/'+req.params.id });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const destroy = async (req, res) => {
  try {
    const courseCategory = await service.findById(req.params.id);
    courseCategory.setCategories([]);

    const data = await service.destroy(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted successfully', redirectTo: '/admin/course' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err });
  }
};

export const renderCreate = async (req, res) => {
  try {
    const categories = await categoryService.findAll({limit: 100, offset: 0});
    res.status(200).render('./admins/course_create', {
      pageTitle: "Create Course",
      layout: "admin",
      categories: categories.categories
    });
  } catch (err) {
    console.log(err)
    res.status(500).render('errors/500', { error: err });
  }
};