const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../../models/User'); //load user's model

const jwtsecret = "secret";
const app = express();
//passport middleware
app.use(passport.initialize());

//passport config
require('../../config/passport')(passport);

router.get('/test', (req, res) => {
    res.json({
        msg: "User works"
    });
})

//New user registration
router.post('/register', (req, res) => {
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            return res.json({
                msg: "Email already exists"
            });
        } else {
            let avatar = gravatar.url(req.body.email, {
                s: "200",
                r: "pg",
                d: '404'
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(18, (err, salt) => {
                bcrypt.hash(newUser.password, salt, function (err, hash) {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });

            res.json({msg: "signup successful"})

        }
    });
});

//existin user's log in
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email
    }).then(user => {
        if (!user) {
            return res.status(400).json({
                msg: "User not found"
            });
        }
        //check the user password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {
                    const payload = {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar
                    }; //create JWT payload
                    const token = jwt.sign(payload, jwtsecret, {
                        expiresIn: 3600
                    });
                    res.json({
                        login: true,
                        token: 'Bearer ' + token
                  });
                } else {
                    return res.status(400).json({
                        msg: "wrong password"
                    });
                }
            });
    })
})

//@route    GET api/users/current
//@desc     return current user
//@access   private

router.get('/current', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
})

module.exports = router;