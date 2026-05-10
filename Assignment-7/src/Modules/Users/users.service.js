import { UsersModel } from "../../DB/Models/users.model.js";

// 1. Create a new user (using build and save)
export const signupUser = async (req, res) => {
  try {
    const user = UsersModel.build(req.body);
    await user.save();
    return res.status(201).json({ message: "User added successfully." });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email already exists." });
    }
    return res.status(400).json({ message: error.message });
  }
};

// 2. Create or update based on PK (skip validation)
export const upsertUser = async (req, res) => {
  try {
    const { id } = req.params;
    let user = await UsersModel.findByPk(id);

    if (!user) {
      user = UsersModel.build({ id, ...req.body });
    } else {
      user.set(req.body);
    }

    await user.save({ validate: false });
    return res.status(200).json({ message: "User created or updated successfully" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      errorDetails: error.message,
    });
  }
};

// 3. Find user by email
export const getUserByEmail = async (req, res) => {
  try {
    const user = await UsersModel.findOne({ where: { email: req.query.email } });
    if (!user) return res.status(404).json({ message: "no user found" });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 4. Retrieve user by PK, excluding "role"
export const getUserById = async (req, res) => {
  try {
    const user = await UsersModel.findByPk(req.params.id, {
      attributes: { exclude: ["role"] },
    });
    if (!user) return res.status(404).json({ message: "no user found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
