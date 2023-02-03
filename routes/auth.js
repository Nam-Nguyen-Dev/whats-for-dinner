const express = require("express");
const router = express.Router();
const passport = require("passport")

//Main Routes - simplified for now
router.get("/google", passport.authenticate('google', { scope: ['profile']}));
router.get("/google/callback", passport.authenticate('google', { failureRedirect: '/login'}), 
(req, res) => {
    res.redirect('/feed')
}
)

module.exports = router;
