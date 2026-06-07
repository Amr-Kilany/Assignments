import usersModel from "../../DB/Models/users.model.js";
import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const usersArray = Array.isArray(req.body) ? req.body : [req.body];

    const processedUsers = usersArray.map((user) => {
      return {
        ...user,
        password: bcrypt.hashSync(user.password, 8),
        phone: CryptoJS.AES.encrypt(user.phone, process.env.ENCRYPTION_KEY).toString(),
      };
    });

    await usersModel.insertMany(processedUsers);

    res.status(201).json({ message: "All users added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usersModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3h" });

    res.status(200).json({ message: "login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, name, phone, age } = req.body;

    if (email) {
      const emailExists = await usersModel.findOne({ email, _id: { $ne: req.userId } });
      if (emailExists) return res.status(400).json({ message: "Email already exists." });
    }

    let updateData = { email, name, age };
    if (phone) {
      updateData.phone = CryptoJS.AES.encrypt(phone, process.env.ENCRYPTION_KEY).toString();
    }

    const updatedUser = await usersModel.findByIdAndUpdate(req.userId, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await usersModel.findByIdAndDelete(req.userId);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

export const getUserData = async (req, res) => {
  try {
    const user = await usersModel.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const decryptedPhone = CryptoJS.AES.decrypt(user.phone, process.env.ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);

    const userObj = user.toObject();
    userObj.phone = decryptedPhone;

    res.status(200).json(userObj);
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};
