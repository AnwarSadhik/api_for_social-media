import Post from "../models/postModel.js";
import { uploadFile } from "../helper/aws.js";
import User from "../models/userModel.js";

export const createPost = async (req, res) => {
      try {
        const file = req.files[0];

        const s3Link = await uploadFile(file)
        const newPost = new Post({
          caption: req.body.caption,
          userId: req.user._id,
          Url: s3Link
        })

        await newPost.save();
        return res.status(200).json({ type: "Success", data: newPost });


      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
}

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({"message": "Couldn't find post"});
    }

    post.caption = req.body.caption;
    await post.save();

    res
      .status(200)
      .json({ status: "success", data: post });
  } catch (error) {
    res.json(400).json({ message: error.message });
  }
};
export const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ status: "success", message: "deleted successfully" });
  } catch (error) {
    res.json(400).json({ message: error.message });
  }
};
export const singlePost = async (req, res) => {
  try {
    const {postId} = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message:"Post not found"});
    }

    res.status(200).json({ status: "success", data: post });
  } catch (error) {
    res.json(400).json({ message: error.message });
  }
};
export const getOwnPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user._id });
    
    if (!posts) {
      return res.status(404).json({ message:"No posts found" });
    }

    res.status(200).json({ status: "success", data: posts });
  } catch (error) {
    res.json(400).json({ message: error.message });
  }
};
export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({ status: "success", data: posts });
  } catch (error) {
    res.json(400).json({ message: error.message });
  }
};

export const addView = async (req, res, next) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res
      .status(200)
      .json({ type: "Success", message: "The view has been increased" });
  } catch (error) {
    next(error);
  }
};

// trand
export const trandVideos = async (req, res, next) => {
  try {
    const videos = await Post.find().sort({ views: -1 });
    res.status(200).json({ type: "success", data: videos });
  } catch (error) {
    next(error);
  }
};

// Search
// export const search = async (req, res, next) => {
//   const query = req.query.q;

//   try {
//     const videos = await Post.find({
//       caption: { $regex: query, $options: "i" },
//     }).limit(40);
//     res.status(200).json({ type: "success", data: videos });
//   } catch (error) {
//     next(error);
//   }
// };

export const savePost = async (req, res) => {
  const { postId } = req.params;
  const postExists = await Post.findById(postId);
  const currentUser = await User.findById(req.user._id);

  if (!postExists) {
    return res.status(404).send({"message": "Post not Found"})
  }

  if (currentUser.savedPosts.toString().includes(postId.toString())) {
    return res.status(400).send({ message: "You already saved the post"})
  }

  await User.findByIdAndUpdate(req.user._id, { $push: { savedPosts: postId } })
  return res.status(200).json({ success: true, message: "Post saved successfully" });
}
export const unSavePost = async (req, res) => {
    const { postId } = req.params;
    const postExists = await Post.findById(postId);

    if (!postExists) {
      return res.status(404).send({"message": "Post not Found"})
    }

    const savedPosts = await User.findByIdAndUpdate(req.user._id, { $pull: { savedPosts: postId } })
    return res.status(200).json({ succes: true, data: "Post removed from saves" });
}