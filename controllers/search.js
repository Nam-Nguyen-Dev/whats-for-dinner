const Post = require("../models/Post");
const User = require("../models/User")

module.exports = {
    postSearch: async (req, res) => {
        try {
            const searchTerm = new RegExp(`.*${req.body.searchIngredients}.*`);
            
            const posts = await Post.find({ ["ingredients"]: { $regex: searchTerm } })
            .sort({ createdAt: 'desc' })
            .lean()
            var users = []
            for(i in posts){
                var user = await User.findById(posts[i].user)
                users.push(user.userName)
            }  
            res.render('feed.ejs', {posts: posts, userName: users,user: req.user})
          
        } catch (err) {
          console.log(err);
        }
  }
}