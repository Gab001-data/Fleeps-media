//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _= require("lodash");
const mongoose= require("mongoose");
const fileUpload = require('express-fileupload');
const path= require("path");
const model= require(__dirname+"/models/model.js")


const app = express();
app.use(fileUpload());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use('/category', express.static('public'));//for routs prefixed with 'category'   e.g /category/categoryName
app.use('/category/:category/', express.static('public'));

// Database connection
mongoose.connect('mongodb://localhost/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});
// Testing connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connection to database successful!");
});
// Author/Admin schema
// const authorSchema= new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   mobile: String,
//   email: String

// })
// // User schema & model
// const usersSchema= new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   email: String,
//   image: String
// });
// const user= new mongoose.model("user", usersSchema);
// // Tags schema
// const tagSchema= new mongoose.Schema({
//   name: String
// });
// // Category schema
// const categorySchema= new mongoose.Schema({
//   name: String
// });
// // Post schema
// const  postSchema= new mongoose.Schema({
//   author: String, //authorSchema-this type applies when admin/author accounts are created
//   title: String,
//   description: String,
//   category: String,
//   tag: [String],
//   content: String,
//   image: String,
//   audio: String,
//   video: String,
//   createdAt: {
//     type: Date,
//     default: new Date()
//   },
//   clicks: Number

// });
// const Post= new mongoose.model("Post", postSchema);
// // Comment schema & model
// const commentSchema= new mongoose.Schema({
//   postId: String,
//   content: String,
//   createdAt: {
//     type: Date,
//     default: new Date()
//   },
//   user: usersSchema,
//   likes: Number
// });
// const comment= new mongoose.model('Comment', commentSchema)
// // Reply schema & model
// const replySchema = new mongoose.Schema({
//   commentId: String,
//   content: String,
//   createdAt: {
//     type: Date,
//     default: new Date()
//   },
//   user: usersSchema,
//   likes: Number
// });
// const reply= new mongoose.model('Reply', replySchema);
// // category model
const category= model.category;
const sport=new category({name:"Sports"});
const business=new category({name:"Business"});
const entertainment= new category({name:"Entertainment"});
const lifestyle= new category({name:"Lifestyle"});
const fashion= new category({name:"Fashion"});
const events= new category({name:"Events"});
const talent= new category({name:"Talent"});
const categories=[sport, business, entertainment,lifestyle,fashion,events,talent];

//tag model
const tag= model.tag;
const tags= [
  new tag({name: "Travel"}),
  new tag({name: "Job"}),
  new tag({name: "Football"}),
  new tag({name: "Video"}),
  new tag({name: "Music"}),
  new tag({name: "Ideas"}),
  new tag({name: "News"}),
  new tag({name: "lifestyle"})
]
app.get("/", async (req,res)=>{
  // Trending Post Query
  // const date= new Date();
  // let startDate= date.setDate(date.getDate()-7);
  // startDate= new Date(startDate);
  // let endDate= startDate.setDate(startDate.getDate()+1);
  // endDate= new Date(endDate);
  const postDoc= await model.post.find({category: {$nin: ['Talent', 'Events']}}, (err)=>{
    if(err){
      console.log(err)
    }
  }).sort({createdAt: -1}).limit(10);
  console.log(postDoc);
  // Categories Query/Sports
  const sportDoc= await model.post.find({category: 'Sports'}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({createdAt: -1}).limit(3);
  console.log(sportDoc);
  // Categories Query/Business
  const businessDoc= await model.post.find({category: 'Business'},(err)=>{
    if(err){
      console.log(err);
    }
  }).sort({createdAt: -1}).limit(3);
  // Categories Query/Entertainment
  const entertainmentDoc= await model.post.find({category: 'Entertainment'}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({createdAt: -1}).limit(3);
  // Categories Query/Talent
  const talentDoc= await model.post.find({category: 'Talent'}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({createdAt: -1}).limit(1);
  // Categories Query/Lifestyle
  const lifestyleDoc= await model.post.find({category: 'Lifestyle'}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({createdAt: -1}).limit(3);
  // Categories Query/Fashion
  const fashionDoc= await model.post.find({category: 'Fashion'}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({createdAt: -1}).limit(3);
   // Categories Query/Event
   const eventDoc= await model.post.find({category: 'Events'}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({createdAt: -1}).limit(3);
  // Categories Query/Recent
  const recentDoc= await model.post.find({}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({createdAt: -1}).limit(7);
  // Categories Query/Popular
  const popularDoc= await model.post.find({}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({clicks: -1}).limit(7);

  res.render("home", 
  {
    postDoc: postDoc,
    sportDoc: sportDoc,
    businessDoc: businessDoc,
    entertainmentDoc: entertainmentDoc,
    talentDoc: talentDoc,
    lifestyleDoc: lifestyleDoc,
    fashionDoc: fashionDoc,
    eventDoc: eventDoc,
    recentDoc:recentDoc,
    popularDoc: popularDoc


  });
});

app.get("/contact", async function(req,res){
  // Categories Query/Recent
  const recentDoc= await model.post.find({}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({createdAt: -1}).limit(7);
  res.render("contact", /*{contacts:contactContent}*/);
});

app.get("/about", async function(req,res){
  // Categories Query/Recent
  const recentDoc= await model.post.find({}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({createdAt: -1}).limit(7);
  res.render("about"/*, {about:aboutContent}*/);

});

app.get("/compose", (req,res)=>{
  model.category.find({}, function(err,result){
    if(result.length===0){
      model.category.insertMany(categories, function(err,doc){
        if(err){
          console.log(err)
        }
        else{
          console.log("Categories added successfully");
        }
      });
      res.redirect("/compose");
    }else{
      res.render("compose", {categories:result});
    }
  }); 
});
app.post("/compose", function(req,res){
  if(!req.files || Object.keys(req.files).length===0){
    return res.status(400).send("file not uploaded");
  }

  let sampleFile = req.files.myfile;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(__dirname+"/public/data/uploads/"+sampleFile.name, function(err) {
      if (err)
        return res.status(500).send(err);
        //post model
        let post= req.body;
        post.image='/data/uploads/'+sampleFile.name;
        post.clicks=0;
        model.post.create(post, function(err){
          if(err){
            console.log(err)
          }else{
            console.log("database updated successfully");
          }
        })
        res.send('File uploaded!');
    });

});

app.get("/category/:category/:postId", async function(req,res){
  const postId= req.params.postId;
  const categoryName= _.capitalize(req.params.category);
  const postDoc= await model.post.find({_id:postId},(err)=>{
    console.log(err);
  });
  // Update clicks
  const clicks= postDoc[0].clicks+1;
  model.post.updateOne({_id:postId},{$set:{clicks:clicks}}, (err, result)=>{
    console.log(err);
  });
  // Categories Query/Recent
  const recentDoc= await model.post.find({}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({createdAt: -1}).limit(7);
  // Categories Query/Popular
  const popularDoc= await model.post.find({}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({clicks: -1}).limit(7);
  // Categories Query/Talent
  const talentDoc= await model.post.find({category: 'Talent'}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({createdAt: -1}).limit(1);
  // Comment Query
  const commentDoc= await model.comment.find({postId: String(postDoc[0]._id) }, (err)=>{
    console.log(err);
  }).sort({createdAt:-1});
  // Reply Query
  const replyDoc= await model.reply.find({}, (err)=>{
    console.log(err);
  }).sort({createdAt:-1});
  res.render("post",
  {
    postDoc: postDoc, 
    recentDoc: recentDoc,
    popularDoc: popularDoc,
    talentDoc: talentDoc,
    commentDoc: commentDoc,
    replyDoc: replyDoc 
  }); 
})

app.get("/category/:category", async function(req,res){
  const categoryName=_.capitalize(req.params.category)
  const categoryDoc= await model.post.find({category:categoryName}, (err)=>{
    console.log(err);
  }).sort({createdAt:-1});
  // Categories Query/Recent
  const recentDoc= await model.post.find({}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({createdAt: -1}).limit(7);
  // Categories Query/Popular
  const popularDoc= await model.post.find({}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({clicks: -1}).limit(7);
  // Categories Query/Talent
  const talentDoc= await model.post.find({category: 'Talent'}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({createdAt: -1}).limit(1);
  res.render("category", 
  {
    categoryDoc: categoryDoc,
    recentDoc:recentDoc,
    talentDoc: talentDoc,
    popularDoc: popularDoc
  }); 
});
app.post("/comment", async (req,res)=>{
  let postUser= new model.user({
    firstName: req.body.fname,
    lastName: req.body.lname,
    email: req.body.email,
  });
  postUser.save();
  const newComment= new model.comment({
    postId: req.body.postId,
    content: req.body.content,
    user: postUser
  });
  newComment.save();
  res.redirect("/category/"+req.body.category+"/"+req.body.postId);

});
app.post("/reply", (req, res)=>{
  let replyUser= new model.user({
    firstName: req.body.fname,
    lastName: req.body.lname,
    email: req.body.email,
  });
  replyUser.save();
  let newReply= new model.reply({
    commentId: req.body.commentId,
    content: req.body.content,
    user: replyUser
  })
  newReply.save();
  res.redirect("/category/"+req.body.category+"/"+req.body.title);
});















app.listen(3000, function() {
  console.log("Server started on port 3000");
});

// Posts
//   PostID (identity)
//   PostTitle (varchar)
//   PostDate (datetime)
//   Deleted (int)
//   OwnerID (int FK to Users)

// PostDetails
//   PostDetailID (identity)
//   PostID (FK to Posts)
//   Sequence (int) -> for long posts you order by this
//   PostText (text)

// Comments
//   CommentID (identity)
//   Comment (text)
//   CommenterID (int FK to Users)
//   CommentDate (datetime)
//   Deleted (int)

// Users
//   UserID (identity)
//   UserNAme (varchar)
//   UserEmail (varchar)
//   CreatedDate (datetime)
//   Active (int)