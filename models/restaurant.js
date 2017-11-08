'use strict';
module.exports = (sequelize, DataTypes) => {
  var restaurant = sequelize.define('restaurant', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    category: DataTypes.STRING
  });

  restaurant.prototype.get_reviews = function () {
    return this.sequelize.models.review.findAll(
      {
        where: {restaurantId: this.id},
        include: [{model: this.sequelize.models.reviewer}]
      }
    );
  };

  return restaurant;
};
