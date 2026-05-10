import { sequelize } from "../connection.js";
import { DataTypes, Model } from "sequelize";

export class CommentsModel extends Model {}

CommentsModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    postId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "Comments",
    timestamps: true,
    paranoid: true,
  },
);
