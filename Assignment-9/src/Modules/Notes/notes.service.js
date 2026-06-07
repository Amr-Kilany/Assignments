import notesModel from "../../DB/Models/notes.model.js";
import mongoose from "mongoose";

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    await notesModel.create({ title, content, userId: req.userId });
    res.status(201).json({ message: "Note created" });
  } catch (error) {
    res.status(400).json({ message: "Error", error: error.message });
  }
};

export const updateSingleNote = async (req, res) => {
  try {
    const note = await notesModel.findOneAndUpdate(
      { _id: req.params.noteId, userId: req.userId },
      { $set: req.body },
      { new: true },
    );
    if (!note) return res.status(404).json({ message: "You are not the owner or Note not found" });
    res.status(200).json({ message: "updated", note });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

export const replaceNote = async (req, res) => {
  try {
    const note = await notesModel.findOneAndReplace(
      { _id: req.params.noteId, userId: req.userId },
      { ...req.body, userId: req.userId },
      { new: true },
    );
    if (!note) return res.status(404).json({ message: "You are not the owner or Note not found" });
    res.status(200).json({ message: "replaced", note });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

export const updateAllTitles = async (req, res) => {
  try {
    await notesModel.updateMany({ userId: req.userId }, { title: req.body.title });
    res.status(200).json({ message: "All notes updated" });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

export const deleteSingleNote = async (req, res) => {
  try {
    const note = await notesModel.findOneAndDelete({ _id: req.params.noteId, userId: req.userId });
    if (!note) return res.status(404).json({ message: "You are not the owner or Note not found" });
    res.status(200).json({ message: "deleted", note });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

export const getPaginatedNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const notes = await notesModel.find({ userId: req.userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await notesModel.findOne({ _id: req.params.id, userId: req.userId });
    if (!note) return res.status(404).json({ message: "You are not the owner or Note not found" });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

export const getNoteByContent = async (req, res) => {
  try {
    const note = await notesModel.findOne({ content: req.query.content, userId: req.userId });
    if (!note) return res.status(404).json({ message: "No note found" });
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

export const getNotesWithUser = async (req, res) => {
  try {
    const notes = await notesModel
      .find({ userId: req.userId })
      .select("title userId createdAt")
      .populate("userId", "email -_id");

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

export const getNotesAggregate = async (req, res) => {
  try {
    const { title } = req.query;

    let matchStage = { userId: new mongoose.Types.ObjectId(req.userId) };
    if (title) {
      matchStage.title = { $regex: title, $options: "i" };
    }

    const notes = await notesModel.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $project: { title: 1, content: 1, "user.name": 1, "user.email": 1 } },
    ]);

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

export const deleteAllNotes = async (req, res) => {
  try {
    await notesModel.deleteMany({ userId: req.userId });
    res.status(200).json({ message: "Deleted all user notes" });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};
