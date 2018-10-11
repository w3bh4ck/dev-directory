const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const passport = require('passport');
const Profile = require("../../models/Profile");

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', (req, res) => {
    Post.find()
    .sort({date: -1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404));
})

// @route   GET api/posts/:id
// @desc    Get a single posts
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
    .sort({date: -1})
    .then(post => res.json(post))
    .catch(err => res.status(404));
})

// @route   DELETE api/posts/:id
// @desc    Delete a single posts
// @access  private
router.delete('/:id', passport.authenticate("jwt", {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
            .then(post => {
                //check for post owner
                if(post.user.toString() !== req.user.id) {
                    return res.status(401).json({authorisation: false});
                }
                post.remove().then(() => res.json({delete: true}));
            })
            .catch(err => res.status(404).json({msg: "post not found"}));
        })
})

// @route   post api/posts/like/:id
// @desc    Like post
// @access  private
router.post('/like/:id', passport.authenticate("jwt", {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
            .then(post => {
                if(post.likes.filter(like =>like.user.toString() === req.user.id).length === 0 ){
                    return res.status(400).json({notliked: 'You have not liked this post'});
                }
                //Get the post remove index
                const removeIndex = post.likes
                .map(item => item.user.toString())
                .indexOf(req.user.id);

                //splice out of the array
                post.likes.splice(removeIndex, 1);

                //save
                post.save().then(post => res.json(post));
                    
            })
            .catch(err => res.status(404).json({msg: "post not found"}));
        })
})

// @route   DELETE api/posts/unlike/:id
// @desc    Unlike post
// @access  private
router.post('/unlikelike/:id', passport.authenticate("jwt", {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
            .then(post => {
                if(post.likes.filter(like =>like.user.toString() === req.user.id).length > 0 ){
                    return res.status(400).json({alreadyliked: 'User Already liked this post'});
                }
                //Add user id to likes array
                post.like.unshift({user: req.user.id});

                post.save().then(post => res.json(post));
            })
            .catch(err => res.status(404).json({msg: "post not found"}));
        })
})


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

// @route   POST api/posts/comment/:id
// @desc    Create a comment
// @access  Private
router.post('/comment/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }
            post.comment.unshift(newComment);

            //save
            post.save().then(post => res.json(post))
        }).catch(err => res.status(404).json({postnotfound: 'No post found'}));
})



// @route   DELETE api/posts/comment/:id
// @desc    Remove a comment from post
// @access  Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            //check if the comment exists
            if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length ===0){
                return res.status(400).json({commentnotexist: 'comment does not exist'});
            }

            //get remove index
            const removeIndex = post.comments
                .map(item => item._id.toString())
                .indexOf(req.params.comment_id);
            //splice comment out of the array
            post.comments.splice(removeIndex, 1);

            post.save().then(post => res.json(post));

        }).catch(err => res.status(404).json({postnotfound: 'No post found'}));
})

module.exports = router;