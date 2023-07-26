const express = require ('express');
const router = express.Router();
const auth = require ('../../middlweare/auth');
const bcrypt = require ('bcryptjs');
const config = require ('config');
const {check , validationResult} = require("express-validator");
const jwt = require ('jsonwebtoken');
const User = require ('../../models/User');
router.get('/',auth, async (req,res) => {
    try {
     const user = await User.findById(req.user.id).select('-password');
     res.json(user);
    }catch(err){
     console.error(err.message);
     res.status(500).sendStatus('server error');
    }
}); 
router.post('/',
 [ 
    check('email','please enter a valid email').isEmail(),
    check('password','password is required').exists()
],
 async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const { email , password }=req.body;
    try{
        let user = await User.findOne ({email});
        if (!user){
           return res.status(400).json({ errors : [{msg:'invalid'}] });
        }
         const ismatch = await bcrypt.compare(password, user.password);
         if (!ismatch){
            return res.status(400).json({ errors : [{msg:'invalid'}] });
         }
       const payload = {
        user : {
            id : user.id
        }
       }
       jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
            if (err)throw err ;
            res.json({token});
        }  
        );

        //res.send('user reqistred');
    }catch(err){
      console.error(err.message);
      res.status(500).send('server error');
    }
    
});

module.exports=router;