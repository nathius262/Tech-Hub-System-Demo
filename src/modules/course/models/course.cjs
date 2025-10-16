'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Course.belongsToMany(models.Category, {
        through: 'course_categories',
        foreignKey: 'course_id',
        as: 'categories'
      });
    }
  }
  Course.init({
    title: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.DECIMAL
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue:1,
      comment: 'Duration in weeks'
    },
    description: {
      type: DataTypes.TEXT
    },
    image_url: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Course',
    tableName: 'courses'
  });
  return Course;
};