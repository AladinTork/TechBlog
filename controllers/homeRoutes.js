const router = require("express").Router();
const { User, Post, Comment } = require("../models");
const withAuth = require("../utils/auth");

// router.get("/", async (req, res) => {
//   try {
//     // Check if the user is logged in
//     const loggedIn = req.session.loggedIn || false;
//     const user = loggedIn ? { username: req.session.username } : null;

//     // Render the homepage with the user context
//     res.render("homepage", {
//       user,
//       loggedIn,
//       pageTitle: "TechBlog",
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get("/", async (req, res) => {
  try {
    // Fetch all posts along with their authors and comments
    const postData = await Post.findAll({
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
      order: [["date_created", "DESC"]],
    });

    const posts = postData.map((post) => post.get({ plain: true }));
    const loggedIn = req.session.loggedIn || false;

    const user = loggedIn ? { username: req.session.username } : null;

    res.render("homepage", {
      user,
      posts,
      loggedIn,
      pageTitle: "TechBlog",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/dashboard", withAuth, async (req, res) => {
  try {
    console.log("Session userId:", req.session.userId);
    // Fetch all posts by the logged-in user
    const userPosts = await Post.findAll({
      where: {
        user_id: req.session.userId,
      },
      include: {
        model: User,
        as: "author",
        attributes: ["username"],
      },
    });

    // Serialize posts data
    const posts = userPosts.map((post) => post.get({ plain: true }));

    console.log("Posts found:", posts);
    // Render dashboard with the posts
    res.render("dashboard", {
      posts,
      loggedIn: req.session.loggedIn,
      pageTitle: "Your dashboard",
    });
  } catch (err) {
    console.error("Error fetching user posts", err);
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // Check if the user is logged in and redirect if so
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login", {
    loggedIn: req.session.loggedIn || false,
    pageTitle: "TechBlog",
  });
});

module.exports = router;
