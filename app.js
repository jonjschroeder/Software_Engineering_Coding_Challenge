// dependencies
const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
// cors middleware - make request to api from another domain name
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
mongoose.Promise = global.Promise
// connect to database
mongoose.connect(config.database);
//On connection
mongoose.connection.on('connected', ()=>{
    console.log('Connected to database ' +config.database);
});

mongoose.connection.on('err', ()=>{
    console.log('Database error ' +err);
});

// initializing app variable with express
const app = express();
// number into port variable

const users = require('./routes/users');
const port = 3000;
// making public so any domain can access and authentification purposes
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

//passport
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
// route to homepage
app.get('/', (req, res)=>{
    res.send('Invalid Endpoint');
});
app.get('/', (req,res)=>{
    res.send('Invalid Endpoint');
});
// listen function takes in port and starts of server
app.listen(port, () => {
    console.log('Server started on port ' +port);
});