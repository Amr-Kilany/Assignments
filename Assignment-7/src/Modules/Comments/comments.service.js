import { CommentsModel } from "../../DB/Models/comments.model.js";
import { UsersModel } from "../../DB/Models/users.model.js";
import { PostsModel } from "../../DB/Models/posts.model.js";
import { Op } from "sequelize";

// 1. Bulk Create
export const createBulkComments = async (req, res) => {
  try {
    await CommentsModel.bulkCreate(req.body.comments);
    return res.status(201).json({ message: "comments created." });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// 2. Update specific comment (Owner only)
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;

    const comment = await CommentsModel.findByPk(commentId);
    if (!comment) return res.status(404).json({ message: "comment not found." });

    if (comment.userId !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this comment." });
    }

    comment.content = content;
    await comment.save();
    return res.status(200).json({ message: "Comment updated." });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 3. Find or Create
export const findOrCreateComment = async (req, res) => {
  try {
    const { postId, userId, content } = req.body;
    const [comment, created] = await CommentsModel.findOrCreate({
      where: { postId, userId, content },
    });
    return res.status(200).json({ comment, created });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// 4. Search and Count
export const searchComments = async (req, res) => {
  try {
    const { word } = req.query;
    const { count, rows } = await CommentsModel.findAndCountAll({
      where: { content: { [Op.like]: `%${word}%` } },
    });

    if (count === 0) return res.status(404).json({ message: "no comments found." });
    return res.status(200).json({ count, comments: rows });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 5. 3 Most Recent comments for a post
export const getNewestComments = async (req, res) => {
  try {
    const comments = await CommentsModel.findAll({
      where: { postId: req.params.postId },
      order: [["createdAt", "DESC"]],
      limit: 3,
    });
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 6. Specific Comment with User & Post info
export const getCommentDetails = async (req, res) => {
  try {
    const comment = await CommentsModel.findByPk(req.params.id, {
      include: [
        { model: UsersModel, attributes: ["id", "name", "email"] },
        { model: PostsModel, attributes: ["id", "title", "content"], paranoid: false },
      ],
      attributes: ["id", "content"],
    });

    if (!comment) return res.status(404).json({ message: "no comment found" });
    return res.status(200).json(comment);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
