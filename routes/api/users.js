const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const User = require('../../models/User'); //load user's model

router.get('/test', (req, res) => {
    res.json({msg: "User works"});
})


//New user registration
router.post('/register', (req, res) => {
   User.findOne({email: req.body.email}).then(user => {
       if(user){
           return res.status(400).json({msg: "Email already exists"});
       }else{
           let avatar = gravatar.url(req.body.email, {
               s: "200",
               r: "pg", 
               d: 'mm'
           });

           const newUser = new User({
               name: req.body.name,
               email: req.body.email,
               avatar,
               password: req.body.password
           });

           bcrypt.genSalt(18, (err, salt) => {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
            });
        });

       }
   });
});

//existin user's log in
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email}).then(user => {
        if(!user){
            return res.status(400).json({msg: "User not found"});
        }
        //check the user password
        bcrypt.compare(password, user.password)
        .then(isMatch => {
            if(isMatch){
                res.json({msg: 'success'});
            }else{
                return res.status(400).json({msg: "wrong password"});
            }
        });
    })
})



module.exports = router;