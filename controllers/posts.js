const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const User = require("../models/User")
const Comment = require("../models/Comment")
const capitalize = require("../utils/capitalize")

module.exports = {
  getAddRecipe: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("add-recipe.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getRecipes: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id })
      .sort({ createdAt: 'desc' });
      res.render("my-recipes.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getBookmarks: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: 'desc' });
      res.render("favorite-recipes.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req,res)=>{
    try{
      const posts = await Post.find({ private: {$ne : true} })
      .sort({ createdAt: 'desc' })
      .lean()
      var users = []
      for(i in posts){
        var user = await User.findById(posts[i].user)
        users.push(user.userName)
    }  
      res.render('feed.ejs', {posts: posts, userName: users,user: req.user})
    }catch(err){
      console.log(err)
    }
  },
  getRandom: async (req, res) => {
    try {
      const post = await Post.aggregate([
        { $match: { private: { $ne: true } } },
        { $sample: { size: 1 } }
      ])

      res.redirect("/post/" + post[0]._id)
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const author = await User.findById(post.user)
      const user = await User.findById(req.user.id)
      const comments = await Comment.find({ post: req.params.id })

      var commentUsers = []
      for(i in comments){
        var commentUser = await User.findById(comments[i].user)
        commentUsers.push(commentUser.userName)
      }

      res.render("post.ejs", { post: post, author: author, comments: comments, commentUsers: commentUsers, user: user });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      if (req.file){
        const result = await cloudinary.uploader.upload(req.file.path);

        const standardizedTitle = capitalize.capitalize(req.body.title)

        await Post.create({
          title: standardizedTitle,
          image: result.secure_url,
          cloudinaryId: result.public_id,
          caption: req.body.caption,
          country: req.body.country,
          dish: req.body.dish,
          private: req.body.private,
          ingredients: req.body.ingredients.trim().split('\n'),
          directions: req.body.directions.trim().split('\n'),
          likes: 0,
          user: req.user.id,
        });
        console.log("Post has been added!");
      }

      res.redirect("/my-recipes");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res)=>{
    var liked = false
    try{
      var post = await Post.findById({_id:req.params.id})
      liked = (post.likes.includes(req.user.id))
    } catch(err){
    }
    //if already liked we will remove user from likes array
    if(liked){
      try{
        await Post.findOneAndUpdate({_id:req.params.id},
          {
            $pull : {'likes' : req.user.id}
          })
          
          console.log('Removed user from likes array')
          res.redirect('back')
        }catch(err){
          console.log(err)
        }
      }
      //else add user to like array
      else{
        try{
          await Post.findOneAndUpdate({_id:req.params.id},
            {
              $addToSet : {'likes' : req.user.id}
            })
            
            console.log('Added user to likes array')
            res.redirect(`back`)
        }catch(err){
            console.log(err)
        }
      }
    },
    bookmarkPost: async (req, res)=>{
      var bookmarked = false
      try{
        var post = await Post.findById({_id:req.params.id})
        bookmarked = (post.bookmarks.includes(req.user.id))
      } catch(err){
      }
      //if already bookmarked we will remove user from likes array
      if(bookmarked){
        try{
          await Post.findOneAndUpdate({_id:req.params.id},
            {
              $pull : {'bookmarks' : req.user.id}
            })
            
            console.log('Removed user from bookmarks array')
            res.redirect('back')
          }catch(err){
            console.log(err)
          }
        }
        //else add user to bookmarked array
        else{
          try{
            await Post.findOneAndUpdate({_id:req.params.id},
              {
                $addToSet : {'bookmarks' : req.user.id}
              })
              
              console.log('Added user to bookmarks array')
              res.redirect(`back`)
          }catch(err){
              console.log(err)
          }
        }
      },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/my-recipes");
    } catch (err) {
      res.redirect("/my-recipes");
    }
  },
  getEditPost: async (req, res) => {
    try {
      let post = await Post.findById({ _id: req.params.id });
      res.render("edit-post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  editPost: async (req, res) => {
    try {    
      const standardizedTitle = capitalize.capitalize(req.body.title)

      let post = await Post.findOneAndUpdate(
        {_id:req.params.id},
        {
        title: standardizedTitle,
        caption: req.body.caption,
        country: req.body.country,
        dish: req.body.dish,
        private: req.body.private,
        ingredients: req.body.ingredients.trim().split('\n'),
        directions: req.body.directions.trim().split('\n'),
        }
      );
      console.log("Post has been edited!");
      // Upload image to cloudinary
      if (req.file){
        await cloudinary.uploader.destroy(post.cloudinaryId);
        const result = await cloudinary.uploader.upload(req.file.path);
        await Post.findOneAndUpdate(
          {_id:req.params.id},
          {
          image: result.secure_url,
          cloudinaryId: result.public_id,
          }
        );
        console.log("Image has been edited!");
      } 

      
      res.redirect("/my-recipes");
    } catch (err) {
      console.log(err);
    }
  },
};
