import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import { uploadFile } from "../helper/aws.js";
import path from "path";

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...req.body },
      { new: true }
    );
    res.status(200).json({ type: "success", data: user });
  } catch (error) {
    res.json(400).json({ message: error.message });
  }
};
export const getInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(["-password", "-verifyOtp"])
    
    if (!user) {
      return res.status(400).json({ success: false, message:"User not found"})
    }

    return res.status(200).json({ type: "success", user });


  } catch (error) {
    res.json(400).json({ message: error.message });
  }
};
export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ type: "success", data: user });
  } catch (error) {
    res.json(400).json({ message: error.message });
  }
};

//add like
export const like = async (req, res, next) => {
  try {
    const id = req.user._id;
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found!" })
    if (post.likes.includes(id.toString())) {
      return res.status(400).json({ message: "You already liked this post." });
    }

    await Post.findByIdAndUpdate(postId, {
      $push: { likes: id },
      // $pull: { dislikes: id },
    });
    res.status(200).json({ message: "The post has been liked." });
  } catch (error) {
    res.json(400).json({ message: error.message });
  }
};

// remove like
export const dislike = async (req, res, next) => {
  try {
    const id = req.user._id;
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    await Post.findByIdAndUpdate(postId, {
      // $addToSet: { dislikes: id },
      $pull: { likes: id },
    });
    res.status(200).json({ message: "The post has been disliked." });
  } catch (error) {
    res.json(400).json({ message: error.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const file = req.files[0];

    if (!file) {
      return res.status(400).json({ message: "select a image file" });
    }

    const allowedExts = [".jpg",".jpeg", ".png", ".webp",".svg"]
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!allowedExts.includes(fileExtension)) {
      return res.status(400).json({ message: "Invalid format Please select an image" });
  }

    const link = await uploadFile(file);

    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    user.profilePic = link;
    await user.save();

    return res.status(200).json({ success: true, profilePic: user.profilePic });

  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const updatePicture = async (req, res) => {
    const { userId } = req.params;
    const file = req.files[0]
  try {

    if (!file) {
      return res.status(400).json({ message: "select a image file" });
    }

    const allowedExts = [".jpg",".jpeg", ".png",".svg"]
    const fileExtension = path.extname(file.originalname).toLowerCase();
    // console.log(fileExtension)

    if (!allowedExts.includes(fileExtension)) {
      return res.status(400).json({ message: "Invalid format Please select an image" });
  }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });


    const link = await uploadFile(file);
    user.profilePic = link

    await user.save();

    return res.status(200).json({ message: "Profile updated successfully", profilePic: user.profilePic });


  } catch (error) {
    if (error.response) return res.status(error.response.statusCode).send(error.response.message);
    res.json(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        } 

        return res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
}
export const followUser = async(req, res) => {
      const { followId } = req.body;

      try {
        const userExist = await User.findById(followId);
        const currentUser = await User.findById(req.user._id);

        if (followId.toString() === currentUser._id.toString()) {
          return res.status(400).json({ message: "You cannot follow yourself" });
        }
        
        if (!userExist) {
          return res.status(404).json({ message: "User not found" });
        }

        if (currentUser.following.includes(followId)) {
          return res.status(400).json({ message: "You are already following this user" });
        }

      // const newFollow = Follow({
      //     userId: currentUser._id,
      //     followers: currentUser._id,
      //     following: followId, 
      // })

      // await newFollow.save();

      // currentUser.following.push(followId);
      // await currentUser.save();
  
      // userExist.followers.push(currentUser._id);
      // await userExist.save();


        await User.findByIdAndUpdate(followId, { $push: { followers: req.user._id } },{ new: true});
        await User.findByIdAndUpdate(req.user._id, { $push: { following: followId } },{ new: true });

        return res.status(200).json({ message: 'User followed successfully' });


      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
}

export const unfollowUser = async (req, res) => {
    const { followId } = req.body;

    try {
    
      await User.findByIdAndUpdate(followId,{ $pull: { followers: req.user._id } }, { new: true });
      await User.findByIdAndUpdate(req.user._id,{ $pull: { following: followId } }, { new: true });

      return res.status(200).json({ status: 'ok', message: "User unfollowed" });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

}
export const getFollowers = async(req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found"});
    }

    return res.status(200).json({ success: true, data: user.followers });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export const getFollowing = async(req, res) => {
    const { userId } = req.params 

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found"});
      }

      return res.status(200).json({ success: true, data: user.following});
    
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
}

export const search = async (req, res, next) => {
  const query = req.query.q;

  try {
    const users = await User.find({
      name: { $regex: query, $options: "i" },
    }).limit(40)

    if (users.length === 0) {
      res.status(200).send({ type: "success", message: "No users found" });
    } else {
      res.status(200).send({ type: "success", data: users });
    }
  } catch (error) {
    console.log(error);
    next(error); // Pass the error to the error-handling middleware
  }
};