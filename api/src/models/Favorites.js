const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("favorites", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    updated: {
      //! Revisar porque en el modelo no está
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },{
    timestamps: false,
  });
};