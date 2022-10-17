import UserModel from "../models/user.js";
import bcrypt from "bcrypt";

export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id);

    if (user) {
      // removes the password from the response object
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json(`No such user exists`);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { currentUserId, currentUserAdminStatus, password } = req.body;

  // allows update for owner of the account or if it is an admin
  if (id === currentUserId || currentUserAdminStatus) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }

      // findByIdAndUpdate(user id to be updated, the new object, return the updated info in the response)
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res
      .status(401)
      .json(`Access denied! You can only update your own profile.`);
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { currentUserId, currentUserAdminStatus } = req.body;

  if (currentUserId === id || currentUserAdminStatus) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json(`User deleted successfully.`);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res
      .status(401)
      .json(`Access denied! You can only update your own profile.`);
  }
};

export const followUser = async (req, res) => {
    const { id } = req.params; 
    const { currentUserId } = req.body;

    if(currentUserId === id) res.status(403).json(`Action forbidden! You cannot follow yourself.`);
    else {
        try {
            const followedUser = await UserModel.findById(id); 
            const followerUser = await UserModel.findById(currentUserId);

            if(!followedUser.followers.includes(currentUserId)) {
                await followedUser.updateOne({ $push: { followers: currentUserId } }); 
                await followerUser.updateOne({ $push: { following: id } });
                res.status(200).json(`You started following this user.`); 
            } else {
                res.status(403).json(`You are already following this user.`)
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
}