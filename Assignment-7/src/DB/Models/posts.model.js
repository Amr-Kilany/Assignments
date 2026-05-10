import { sequelize } from "../connection.js";
import { DataTypes, Model } from "sequelize";

export class PostsModel extends Model {}

PostsModel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "Posts",
    timestamps: true,
    paranoid: true,
  },
);
