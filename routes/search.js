const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now

router.post("/", ensureAuth, searchController.postSearch);

module.exports = router;
