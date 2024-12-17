const router = require("express").Router();
const { User, Post, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comment,
          include: {
            model: User,
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

router.post("/:id/comment", withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      content: req.body.commentContent,
      userId: req.session.userId,
      postId: req.params.id,
    });

    res.redirect(`/post/${req.params.id}`);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
