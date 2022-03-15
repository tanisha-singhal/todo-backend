const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser=require('../middleware/fetchUser');
const JWT_SECRET = 'MyNameI$tanuTheHacker';

//Create a user using :POST "/api/users/create". Doesn't require Authentication.
router.post('/create',[
    body('name','Enter a valid name').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 5 characters long.').isLength({min:5})
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        User.findOne({ email: req.body.email }, async (err, userFound) => {
            if(err){
                console.log(err);
                return;
            };
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt)
            if (!userFound) {
                let user = await User.create({
                    name: req.body.name,
                    password: secPass,
                    email: req.body.email,
                });
                const data = {
                    user: {
                        id: user.id
                    }
                }
                const authToken = jwt.sign(data, JWT_SECRET);

                // res.send(req.body);
                res.json({ authToken })
                return;
            }

            res.send({ msg: "user already exist!" });
        })
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server error");
    }

})

//ROUTE:2 Authenticate a user using :POST "/api/users/login". Doesn't require login.
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials." });

        }

        const passwordCompare =await  bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with correct credentials." });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json(authToken)
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server Error");
    }
})
// ROUTE:3 get loggedIn user details  using :POST "/api/users/getuser".login required .
router.post('/getuser',fetchUser, async (req, res) => {
try {
    userId=req.user.id;
    const user=await User.findById(userId).select("-password");
    res.send(user);
} catch (error) {
    console.log(error);
    res.status(500).send("Internal server Error");
}
})
module.exports = router;



