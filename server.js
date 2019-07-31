const express = require ('express');
const ConnectDB = require('./config/db');




const app = express();
app.get('/',(req,res)=> res.send('Api running'));

// initialise bodyparser
app.use(express.json({extended:false}));
// define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));


//connect database
ConnectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`server started on port ${PORT}`));
