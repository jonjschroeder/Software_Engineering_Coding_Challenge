const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const path = require('path')
const User = require('../models/user');

//Register Route
router.post('/register', (req, res, next)=>{
    let newUser = new User({
        name: req.body.name,
        username: req.body.username,
        address: req.body.address,
        phone: req.body.phone,
        ssn:req.body.ssn,
        password: req.body.password
    });

    User.addUser(newUser, (err, user)=>{
        if(err){
            res.json({success: false, msg:'You might be already registered. Try logging in.'});
        } else {
            res.json({success:true, msg:'User registered'});
        
        }
    });
});

router.post('/updateuser', (req, res) => {
    User.findOne({ username: req.body.oldname}, function (err, olddoc){
        console.log(req.body);
        olddoc.name = req.body.newUser.name;
        olddoc.username = req.body.newUser.username;
        olddoc.address = req.body.newUser.address;
        olddoc.phone = req.body.newUser.phone;
        olddoc.ssn = req.body.newUser.ssn;
        if(req.body.newUser.password.length > 0){
            olddoc.password = req.body.newUser.password;
        }
        olddoc.save();
        res.json({success: true, msg: olddoc});
    });
});

router.post('/authenticate', (req, res, next)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user)=>{
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'User not found'})
        }
        User.comparePassword(password, user.password, (err, isMatch)=>{
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign(user, config.secret, {
                    expiresIn:600000
                });
                res.json({
                    success:true, 
                    token:'JWT '+token,
                    user:{
                        id: user._id,                  
                        name: user.name,
                        username:user.username,
                        address:user.address,
                        phone:user.phone,
                        ssn:user.ssn
                    }
                });
            }else{
                return res.json({success:false, msg:'Wrong Password'})
            }
        });
    });
});

router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next)=>{
    res.json({user: req.user})
});


router.get('/all_users', (req, res) => {
    User.find()
    .then(data => {
        res.json(data)
        console.log(data)
    })
    .catch(error => res.json(error))

})

router.all('*', (req, res) => {
    res.sendFile(path.resolve('./public/dist/index.html'))
})


module.exports = router;