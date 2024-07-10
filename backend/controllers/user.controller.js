import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { destroyImage, uploadImage } from "../lib/utils/cloudinaryHelpers.js";

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ userName: username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id).select("-password");
    const currentUser = await User.findById(req.user._id);
    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }
    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }
    // check if we are following or not
    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      // unfollow
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({
        user: userToModify,
        message: "User unfollowed successfully",
      });
    } else {
      // follow
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      // send notification to user
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      await newNotification.save();
      res.status(200).json({
        user: userToModify,
        message: "User followed successfully",
      });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

// export const getSuggestedUsers = async (req, res) => {
//   try {
//     // exclude current user and users already followed by current user
//     const userId = req.user._id;
//     const usersFollowedByCurrentUser = await User.findById(userId).select(
//       "following"
//     );
//     const user = await User.aggregate([
//       { $match: { _id: { $ne: userId } } },
//       { $sample: { size: 10 } },
//     ]);
//     const filteredUsers = user.filter(
//       (u) => !usersFollowedByCurrentUser.following.includes(u._id)
//     );
//     const suggestedUsers = filteredUsers.slice(0, 4);
//     suggestedUsers.forEach((user) => (user.password = null));
//     res.status(200).json(suggestedUsers);
//   } catch (error) {
//     console.log("Error in getSuggestedUsers controller: ", error.message);
//     res.status(500).json({ error: error.message });
//   }
// };

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get users followed by the current user
    const currentUser = await User.findById(userId).select("following");
    const usersFollowedByCurrentUser = currentUser.following;

    // Aggregate to get suggested users
    const suggestedUsers = await User.aggregate([
      { $match: { _id: { $ne: userId, $nin: usersFollowedByCurrentUser } } },
      { $sample: { size: 4 } },
      { $project: { password: 0 } }, // Exclude password field
    ]);

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in getSuggestedUsers controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { fullName, email, userName, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;
  try {
    // Fetch user
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Validate passwords
    if (
      (!newPassword && currentPassword) ||
      (newPassword && !currentPassword)
    ) {
      return res
        .status(400)
        .json({ error: "Please provide both current and new password" });
    }
    if (currentPassword && newPassword) {
      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordCorrect) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }
    if (profileImg) {
      if (user.profileImg) {
        await destroyImage(user.profileImg);
      }

      profileImg = await uploadImage(profileImg);
    }

    if (coverImg) {
      if (user.coverImg) {
        await destroyImage(user.coverImg);
      }

      coverImg = await uploadImage(coverImg);
    }
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.userName = userName || user.userName;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();
    console.log("email", email);
    console.log("user", user);
    user.password = null;
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in updateUser controller: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
