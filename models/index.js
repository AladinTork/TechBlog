const User = require("./User.js");
const Post = require("./Post.js");
const Comment = require("./Comment.js");

// User.hasMany(Post, {
//   foreignKey: "userId",
//   as: "posts",
//   onDelete: "CASCADE",
// });

Post.belongsTo(User, {
  foreignKey: "user_id",
  as: "author",
});

Post.hasMany(Comment, {
  foreignKey: "post_id",
  as: "comments",
  onDelete: "CASCADE",
});

// Comment.belongsTo(Post, {
//   foreignKey: "postId",
//   as: "post",
// });

// User.hasMany(Comment, {
//   foreignKey: "userId",
//   as: "comments",
//   onDelete: "CASCADE",
// });

Comment.belongsTo(User, {
  foreignKey: "user_id",
  as: "author",
});

module.exports = { User, Post, Comment };
