'use strict';
module.exports = (sequelize, DataTypes) => {
  const member = sequelize.define('member', {
    fullname: DataTypes.STRING,
    photo: DataTypes.STRING,
    notes: DataTypes.TEXT,
    joined_at: DataTypes.DATE,
    won_at: DataTypes.DATE
  }, {});
  member.associate = function(models) {
    // associations can be defined here
  };
  return member;
};