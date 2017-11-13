'use strict';
module.exports = (sequelize, DataTypes) => {
  var reviewer = sequelize.define('reviewer', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    karma: DataTypes.INTEGER,
    username: DataTypes.STRING,
    password: DataTypes.STRING(1234)
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return reviewer;
};
