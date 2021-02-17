const mongoose= require("mongoose");

// Author/Admin schema
const authorSchema= new mongoose.Schema({
    firstName: String,
    lastName: String,
    mobile: String,
    email: String
  
  });
module.exports.author= new mongoose.model('author', authorSchema)
  // User schema & model
  const usersSchema= new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    image: String
  });
module.exports.user= new mongoose.model("user", usersSchema);
  // Tags schema
  const tagSchema= new mongoose.Schema({
    name: String
  });
  module.exports.tag= new mongoose.model('tag', tagSchema);
  // Category schema
  const categorySchema= new mongoose.Schema({
    name: String
  });
module.exports.category= new mongoose.model('category', categorySchema);
  // Post schema
  const  postSchema= new mongoose.Schema({
    author: String, //authorSchema-this type applies when admin/author accounts are created
    title: String,
    description: String,
    category: String,
    tag: [String],
    content: String,
    image: String,
    audio: String,
    video: String,
    createdAt: {
      type: Date,
      default: new Date()
    },
    clicks: Number
  
  });
module.exports.post= new mongoose.model("Post", postSchema);
  // Comment schema & model
  const commentSchema= new mongoose.Schema({
    postId: String,
    content: String,
    createdAt: {
      type: Date,
      default: new Date()
    },
    user: usersSchema,
    likes: {
      type: Number,
      default: 0
    },
    flag: String,
    deleted: {
      type: Number,
      default: 0
    }
  });
module.exports.comment= new mongoose.model('Comment', commentSchema)
  // Reply schema & model
  const replySchema = new mongoose.Schema({
    commentId: String,
    content: String,
    createdAt: {
      type: Date,
      default: new Date()
    },
    user: usersSchema,
    likes: {
      type: Number,
      default: 0
    },
    flag: String,
    deleted: {
      type: Number,
      default: 0
    }
  });
module.exports.reply= new mongoose.model("Reply", replySchema);