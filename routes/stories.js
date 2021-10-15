const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const { ensureAuth } = require('../middleware/auth');


// Show add page, GET, /stories/add
router.get('/add', ensureAuth, (req, res) => {
   res.render('stories/add')
});

// Add story on submit click, POST,  /stories
router.post('/', ensureAuth, async (req, res) => {
   try {
      req.body.user = req.user.id
      await Story.create(req.body)
      res.redirect('/dashboard')
   } catch (err) {
      console.error(err);
      res.render('error/500');
   }
});

// Show all story , GET,  /stories
router.get('/', ensureAuth, async (req, res) => {
   try {
      const stories = await Story.find({ status: 'public' })
         .populate('user')
         .sort({ createdAt: 'desc' })
         .lean()

      res.render('stories/index', {
         stories
      });
   } catch (err) {
      console.error(err);
      res.render('error/500');
   }
});

// Show single story, GET,  /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
   try {
      let story = await Story.findById(req.params.id).populate('user').lean()

      if (!story) {
         return res.render('error/404')
      }

      res.render('stories/show', {
         story
      })
   } catch (err) {
      console.error(err);
      res.render('error/404');
   }
});


// Show a user's all stories, GET,  /stories/:id
router.get('/user/:userId', ensureAuth, async (req, res) => {
   try {


      let stories = await Story.find({
         user: req.params.userId,
         status: 'public'
      }).populate('user').lean();

      // console.log(stories);

      res.render('stories/index', {
         stories
      });

   } catch (err) {
      console.error(err);
      res.render('error/500');
   }
});


// edit story , GET,  /stories
router.get('/edit/:id', ensureAuth, async (req, res) => {
   try {
      const story = await Story.findOne({ _id: req.params.id }).lean();

      if (!story) {
         return res.render('error/404');
      }

      if (story.user != req.user.id) {
         res.redirect('/stories')
      }
      else {
         res.render('stories/edit', {
            story
         })
      }
   } catch (err) {
      console.error(err);
      res.render('error/500');
   }
});

// Update Story, PUT, /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {

   try {
      let story = await Story.findById(req.params.id).lean();

      if (!story) {
         return res.render('error/404');
      }

      if (story.user != req.user.id) {
         res.redirect('/stories')
      }
      else {

         // story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
         //    new: true,
         //    runValidators: true
         // });

         story = await Story.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
         });

         res.redirect('/dashboard');
      }
   } catch (error) {
      console.error(error);
      return res.render('error/500');
   }



});


// Delete Story, DELETE, /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {

   try {
      await Story.findByIdAndDelete(req.params.id)
      res.redirect('/dashboard');
   } catch (err) {
      console.error(err);
      return res.render('error/500');
   }

});

module.exports = router;