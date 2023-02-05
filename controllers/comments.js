const Comment = require("../models/Comment")

module.exports = {
    createComment: async (req, res) => {
        try {
          await Comment.create({
              comment: req.body.comment,
              post: req.params.id,
              likes: 0,
              user: req.user.id,
            });
            console.log("Comment has been added!");
          
    
          res.redirect("/post/" + req.params.id);
        } catch (err) {
          console.log(err);
        }
      },
      deleteComment: async (req, res) => {
        try {
          // Find comment by id
          let comment = await Comment.findById({ _id: req.params.id });

          // Delete comment from db
          await Comment.remove({ _id: req.params.id });
          console.log("Deleted Comment");
          res.redirect("back");
        } catch (err) {
          res.redirect("back");
        }
      },
      getEditComment: async (req, res) => {
        try {
          let comment = await Comment.findById({ _id: req.params.id });
          res.render("edit-comment.ejs", { comment: comment, user: req.user });
        } catch (err) {
          console.log(err);
        }
      },
      editComment: async (req, res) => {
        try {
    
          let comment = await Comment.findOneAndUpdate(
            {_id:req.params.id},
            {
            comment: req.body.comment
            }
          );
    
          console.log("Post has been edited!");
          res.redirect("/post/" + comment.post);
        } catch (err) {
          console.log(err);
        }
      },
};
