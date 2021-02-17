//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _= require("lodash");
const mongoose= require("mongoose");
const fileUpload = require('express-fileupload');
const path= require("path");
const model= require(__dirname+"/models/model.js");
let Pusher = require('pusher');


const app = express();
app.use(fileUpload());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use('/category', express.static('public'));//for routs prefixed with 'category'   e.g /category/categoryName
app.use('/category/:category/', express.static('public'));

//initializing pusher with app credentials 
let pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER
});
// Database connection
mongoose.connect('mongodb://localhost/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});
// Testing connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connection to database successful!");
});
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

  // Categories Query/Sports
  const sportDoc= await model.post.find({category: 'Sports'}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({createdAt: -1}).limit(3);
  
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
   // Categories Query/Music
   const MusicDoc= await model.post.find({category: 'Music'}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({createdAt: -1}).limit(8);
  //console.log(MusicDoc);
  // Categories Query/Recent
  const recentDoc= await model.post.find({category: {$nin: ["Talent","Events"]}}, (err)=>{
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
    MusicDoc: MusicDoc,
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
        res.redirect('/');
    });

});

app.get("/category/:category/:postId", async function(req,res){
  const postId= req.params.postId;
  const categoryName= _.capitalize(req.params.category);
  const postDoc= await model.post.find({_id:postId},(err)=>{
    if(err){
      console.log(err);
    }
    
  });
  // Update clicks
  const clicks= postDoc[0].clicks+1;
  model.post.updateOne({_id:postId},{$set:{clicks:clicks}}, (err, result)=>{
    if(err){
      console.log(err);
    }
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
  //Related Post Query
  console.log(postDoc[0].tag);
  const relatedDoc=await model.post.find({_id:{$ne: postDoc[0]._id }, tag:{$in:postDoc[0].tag}}, (err)=>{
    if(err){
      console.log(err);
    }
  }).sort({clicks: -1}).limit(3);;

  // Comment Query
  const commentDoc= await model.comment.find({postId: String(postDoc[0]._id) }, (err)=>{
    console.log(err);
  }).sort({createdAt:-1});
  // Reply Query
  const replyDoc= await model.reply.find({}, (err)=>{
    console.log(err);
  }).sort({createdAt: 1});
  res.render("post",
  {
    postDoc: postDoc, 
    recentDoc: recentDoc,
    popularDoc: popularDoc,
    talentDoc: talentDoc,
    relatedDoc: relatedDoc,
    commentDoc: commentDoc,
    replyDoc: replyDoc 
  }); 
})

app.get("/category/:category", async function(req,res){
  // categoryName could be category name or array of tags
  let categoryName=_.capitalize(req.params.category)
  let categoryDoc= await model.post.find({category:categoryName}, (err)=>{
    console.log(err);
  }).sort({createdAt:-1});
  //checking if request is for related post
  if(categoryDoc.length<1){
    if(categoryName.indexOf(",")>0){
      categoryName=categoryName.split(",");
      console.log(categoryName);
    }
    categoryDoc= await model.post.find({tag:{$in: categoryName}}, (err)=>{
      if(err){
        console.log(err);
      }
    });
  }

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
  res.redirect("/category/"+req.body.category+"/"+req.body.postId);
});
//update comments and reply likes
app.post("/:typeId/:action", async function(req,res){
  let typeId=req.params.typeId;
  let action=req.params.action;
  console.log(typeId,action);
  let commentDoc= await model.comment.find({ _id: typeId});
  if(commentDoc.length>0){
    let commentLikes;
    action==="like"? commentLikes= commentDoc[0].likes+1: commentLikes= commentDoc[0].likes-1;
    console.log(commentLikes);
    model.comment.updateOne({_id:typeId},{$set:{likes:commentLikes}}, (err, result)=>{
      if(err){
        console.log(err);
      }
      /*pusher.trigger('post-events', 'postAction', {typetId: req.params.typeId }, req.body.socketId);
      res.send('');*/
    }); 
    console.log(commentDoc); 
  }else {
    let replyLikes;
    let replyDoc= await model.reply.find({ _id: typeId});
    action==="like"? replyLikes= replyDoc[0].likes+1: replyLikes= replyDoc[0].likes-1;
    console.log(replyLikes);
    model.reply.updateOne({_id:typeId},{$set:{likes:replyLikes }}, (err, result)=>{
      if(err){
        console.log(err);
      } 
      /*pusher.trigger('post-events', 'postAction', {typeId: req.params.typeId }, req.body.socketId);
      res.send('');*/
    });
    console.log(replyDoc);
  }
});
// report comments and replies
app.post("/report/:id/:reportText", async function(req,res){
  const id=req.params.id;
  const reportText= req.params.reportText;
  
  const commentDoc=await model.comment.find({_id:id});
  if(commentDoc.length>0){
    model.comment.updateOne({_id:id},{$set:{flag:reportText}}, (err,result)=>{
      if(err){
        console.log(err);
      }
      console.log(result);
    });

  }else{
    model.reply.updateOne({_id:id},{$set:{flag:reportText}}, (err,result)=>{
      if(err){
        console.log(err);
      }
      console.log(result);
    });
  }


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

/*app.post("/:type/:typeId/:action", async function(req,res){
  let type= req.params.type;
  let typeId=req.params.typeId;
  let action=req.params.action;
  console.log(type, typeId,action);
  if(type==="comment"){
    let commentLikes;
    let commentDoc= await model.comment.find({ _id: typeId});
    action==="like"? commentLikes= commentDoc[0].likes+1: commentLikes= commentDoc[0].likes-1;
    console.log(commentLikes);
    model.comment.updateOne({_id:typeId},{$set:{likes:commentLikes}}, (err, result)=>{
      if(err){
        console.log(err);
      }
      pusher.trigger('post-events', 'postAction', {typetId: req.params.typeId }, req.body.socketId);
      res.send('');
    }); 
    console.log(commentDoc); 
  }else {
    let replyLikes;
    let replyDoc= await model.reply.find({ _id: typeId});
    action==="like"? replyLikes= replyDoc[0].likes+1: replyLikes= replyDoc[0].likes-1;
    console.log(replyLikes);
    model.reply.updateOne({_id:typeId},{$set:{likes:replyLikes }}, (err, result)=>{
      if(err){
        console.log(err);
      } 
      pusher.trigger('post-events', 'postAction', {typeId: req.params.typeId }, req.body.socketId);
      res.send('');
    });
    console.log(replyDoc);
  }
});*/