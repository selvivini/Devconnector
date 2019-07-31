const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check,validationResult} = require('express-validator');

// @route  Get api/auth
// @desc   Test route
// @access Public

router.get('/',auth, async(req,res) => {
    try{
const user = await User.findById(req.user.id).select('-password');
  res.json(user);
    } catch(err){
     console.error(err.message);
     res.status(500).send('server error');
    }
});
// @route  post api/auth
// @desc   Authenticate user and get token
// @access Public

router.post('/', 
  [
   check('email', 'Please enter a valid email ').isEmail(),
   check('password', 'Password is required').exists()

],
// we are going to query the database it returns a promise hence use async await

async (req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
return res.status(400).json({errors:errors.array()});
  }

  const { email, password} = req.body;
  try{
// See if user exists
let user = await User.findOne({ email });
if (!user){
 return res.status(400).json({errors:[{msg: 'Invalid Credentials'}]});

}
const ismatch = await bcrypt.compare(password, user.password);
 if(! ismatch){
  return res.status(400).json({errors:[{msg: 'Invalid Credentials'}]});
 }


// Return jsonwebtoken
const payload ={
  user:{
    id: user.id
  }
};

jwt.sign(payload,
  config.get('jwtSecret'),
  {expiresIn:360000},
(err,token)=>{
if(err) throw err;
res.json({ token });
}
);
}
  catch(err) {
console.log(err.message);
res.status(500).send('Server error');
  }


}
);

module.exports = router;