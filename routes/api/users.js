const express = require('express');

const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//refer https://express-validator.github.io/docs/
const {check,validationResult} = require('express-validator');
// bring in the model to route
const User = require('../../models/User')

// @route  post api/users
// @desc   Register user
// @access Public

router.post('/', 
  [check('name','Name is required').not().isEmpty(),
   check('email', 'Please enter a valid email ').isEmail(),
   check('password', 'Please enter a password with 6 or more characters').isLength({min:6})

],
// we are going to query the database it returns a promise hence use async await

async (req,res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
return res.status(400).json({errors:errors.array()});
  }

  const {name, email, password} = req.body;
  try{
// See if user exists
let user = await User.findOne({ email });
if (user){
 return res.status(400).json({errors:[{msg: 'User already exists'}]});

}
// Get users Gravatar
const avatar =gravatar.url(email,{
  // size
  s:'200',
  // rating
  r:'pg',
  // default
  d:'mm'
  }) 

// creating the instance of the user
user = new User({
  name,email, password, avatar
});

// Encrypt Password
// https://www.npmjs.com/package/bcrypt refer for bcrypt documentation
const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(password,salt);
await user.save();

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