import User from "../models/User.js";
import Post from "../models/Post.js";

export const searchAll = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.json({ jobs: [], people: [], posts: [] });
    }

    const searchRegex = new RegExp(query, "i");

    const [jobs, people, otherPosts] = await Promise.all([
      Post.find({
        postType: "job",
        $or: [
          { "content.jobTitle": searchRegex },
          { "content.jobDescription": searchRegex },
        ],
      }).populate("author", "name role"),

      User.find({
        $or: [{ name: searchRegex }, { skills: searchRegex }],
      }).select("name role bio skills"),

      Post.find({
        postType: { $ne: "job" },
        "content.text": searchRegex,
      }).populate("author", "name role"),
    ]);

    Post.find({
      postType: { $ne: "job" },
      $or: [{ "content.text": searchRegex }, { hashtags: searchRegex }],
    }).populate("author", "name role profilePictureUrl"),
      res.json({ jobs, people, posts: otherPosts });
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: "Server error during search" });
  }
};
