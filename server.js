const express = require('express');
const connectDB = require ('./config/db.js');
const app = express();
connectDB(); // connect to database
app.get('/', (req,res) => res.send('api is running'));
app.use(express.json({extended : false}));
// route
app.use('/api/user',require ('./routes/api/user'));
app.use('/api/posts',require ('./routes/api/posts'));
app.use('/api/auth',require ('./routes/api/auth'));
app.use('/api/profile',require ('./routes/api/profile'));

const PORT =5000;
app.listen(PORT, () => console.log ( `server is running on port ${PORT} `));