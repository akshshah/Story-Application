const express = require('express');
const router = express.Router();
const passport = require('passport');


// Auth with Google , /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))


// Google auth callback , /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
   (req, res) => {
      res.redirect('/dashboard')
   }
)

//logout user, /auth/logout
router.get('/logout', (req, res) => {
   req.logOut()
   res.redirect('/')
})

module.exports = router;