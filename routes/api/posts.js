const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const passport = require('passport');

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    })

    newPost.save().then(post => res.json(post));
})


module.exports = router;