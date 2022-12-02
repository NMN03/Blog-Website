//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Hey there. Hello and Welcome to this blog page. I am Naman Khera, a 19 year old CSE student. I built this blog page as a part of a course I've been taking to learn the skills required for full-stack development.This blog post page has been made using HTML,css(bootstrap),javascript and Node.js(express). Mongoose and MongoDB Atlas have been used as the database.";
const aboutContent = "I am a second year BTECH student pursuing a degree in Computer Science from VIT Vellore.My hobbies include reading, music and playing sports.Currently I am learning how to become a web developer.";
const contactContent = "You can connect with me through any of the following mediums: ";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://NMN:naman@cluster0.tklukzu.mongodb.net/postsDB",{useNewUrlParser:true});

const postsSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post",postsSchema);

app.get("/", function(req, res){
  
   Post.find({},function(err,foundPosts){
    if(!err){
      res.render("home", {
        startingContent: homeStartingContent,
        posts: foundPosts
        });
    }else{
      console.log(err);
    }
   });
  
  
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  
  const postNew = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  postNew.save();

  res.redirect("/");

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  Post.find({},function(err,foundPosts){
    if(!err){
      foundPosts.forEach(function(post){
        const storedTitle = _.lowerCase(post.title);
    
        if (storedTitle === requestedTitle) {
          res.render("post", {
            title: post.title,
            content: post.content
          });
        }
      });
    }else{
      console.log(err);
    }
   });
  
  
  

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
