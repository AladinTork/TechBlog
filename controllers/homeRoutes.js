const router = require("express").Router();
const { User, Post, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    // Check if the user is logged in
    const loggedIn = req.session.loggedIn || false;
    const user = loggedIn ? { username: req.session.username } : null;

    // Render the homepage with the user context
    res.render("homepage", { user, loggedIn });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
