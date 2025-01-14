const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

router.get("/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["username"],
        },
        {
          model: Comment,
          as: "comments",
          include: {
            model: User,
            as: "author",
            attributes: ["username"],
          },
        },
      ],
    });

    if (!postData) {
      res.status(404).json({ message: "No post found with this ID" });
      return;
    }

    const post = postData.get({ plain: true });

    res.render("post", {
      post,
      loggedIn: req.session.loggedIn,
      pageTitle: "Post Details",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to handle comment creation
router.post("/post/:postId/comment", async (req, res) => {
  try {
    const { commentContent } = req.body; // Get the comment content from the request body
    const { postId } = req.params; // Get the post ID from the URL parameter

    // Ensure the user is logged in
    if (!req.session.loggedIn) {
      return res.status(401).json({ message: "You need to be logged in to comment." });
    }

    // Create the new comment
    const newComment = await Comment.create({
      content: commentContent,
      post_id: postId, // Get the post ID from the URL parameter
      user_id: req.session.userId, // Get the user ID from the session
    });

    // Send a response back with the new comment data (optional)
    res.json(newComment);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/create", async (req, res) => {
  try {
    // Check if the user is logged in
    if (!req.session.loggedIn) {
      return res
        .status(401)
        .json({ message: "You need to be logged in to create a post." });
    }
    console.log(req.body);

    // Create a new post
    const newPost = await Post.create({
      name: req.body.name,
      content: req.body.content,
      user_id: req.session.userId, // Assumes userId is saved in the session
    });

    // Redirect to the dashboard or homepage after creating the post
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
