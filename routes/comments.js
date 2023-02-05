const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Comment Routes - simplified for now
router.post("/createComment/:id", ensureAuth, commentsController.createComment);
router.delete("/deleteComment/:id", ensureAuth, commentsController.deleteComment);
router.get("/edit/:id", ensureAuth, commentsController.getEditComment);
router.put("/editPost/:id", ensureAuth, commentsController.editComment)

module.exports = router;