import Comment from "../models/commentModel.js";

export const addComment = async (req, res) => {
  const { postId } = req.params;
  const newComment = new Comment({ 
    ...req.body, 
    userId: req.user._id,
    postId: postId
  });
  try {
    const savedComment = await newComment.save();
    res.status(200).json({ type: "success", data: savedComment });
  } catch (error) {
    res.status(500).json({ type: "error", message: error.message });
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (String(req.user._id) === String(comment.userId)) {
      await Comment.findByIdAndDelete(req.params.id);
      res
        .status(200)
        .json({ type: "success", data: "This comment has been deleted" });
    } else {
      res
        .status(500)
        .json({ type: "error", message: "You can delete only your comment" });
    }
  } catch (error) {
    res.status(500).json({ type: "error", message: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.status(200).json({ type: "success", data: comments });
  } catch (error) {
    res.status(500).json({ type: "error", message: error.message });
  }
};
