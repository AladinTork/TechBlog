const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model {}

Comment.init(
   { 
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Post,
          key: 'id',
        },
        onDelete: 'CASCADE', 
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    }, {
        sequelize,
        modelName: 'user',
        freezeTableName: true,
        underscored: true,
        timestamps: false,
    });

    module.exports = Comment;