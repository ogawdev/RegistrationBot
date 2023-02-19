module.exports = class Models {
  static async Users(Sequelize, sequelize) {
    return sequelize.define("users", {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
      },
      step: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: 0,
      },
      temp: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: 0,
      },
      phone: {
        type: Sequelize.DataTypes.STRING(12),
        is: /^998[389][01345789][0-9]{7}$/,
      },
      is_verify: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      code: {
        type: Sequelize.DataTypes.STRING(10),
      }
    });
  }

  static async Appeals(Sequelize, sequelize) {
    return sequelize.define("appeals", {
      id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
      },
      phone: {
        type: Sequelize.DataTypes.STRING(12),
        is: /^998[389][01345789][0-9]{7}$/,
      },
      full_name: {
        type: Sequelize.DataTypes.STRING,
      },
      text: {
        type: Sequelize.DataTypes.STRING,
      },
    });
  }
};
