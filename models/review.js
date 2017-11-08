'use strict';
module.exports = (sequelize, DataTypes) => {
  var review = sequelize.define('review', {
    stars: DataTypes.INTEGER,
    title: DataTypes.STRING,
    review: DataTypes.STRING
  });

  review.associate = function (models) {
    review.belongsTo(models.restaurant);
    review.belongsTo(models.reviewer);
  };
  return review;
};
