var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

var app = express();
var port = process.env.PORT || 3000;
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

require('./app/services/fb');
// require('./app/services/instagram');
require('./app/services/twitter');

app.get('/', (req, res)=>{
    res.send("Unikom Sentiment Services");
})
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./app/routes/routes'))
mongoose.connect('mongodb://unikom:unikom123@ds111103.mlab.com:11103/unikom-sentiment');
const check = mongoose.connection;

check.on('error', () => {
	console.log('Error connection');
});

check.on('open', () => {
	console.log('mongoodb is connected ..');
});

app.listen(port, ()=>{
    console.log("Listening on 3000");
})
