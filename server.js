(function(){
    'use strict';


    //Load environment variables
    require('dotenv').load();

    // Modules
    var config         = require(__dirname + '/config/config');
    var express        = require('express');
    var app            = express();
    var bodyParser     = require('body-parser');
    var methodOverride = require('method-override');
    var mongoose       = require('mongoose');
    var morgan         = require('morgan');

    // Configuration

    //DB
    function connectDB(){
        mongoose.connect(config.db.url)
        .then(function(){
            console.log('Mongoose Connected');
            console.log('Testing?', process.env.TEST);
            if(process.env.TEST === true) {
                console.log('***********************************************************');
                console.log('***************************WARNING*************************');
                console.log('***********************************************************');
                console.log('You are running a test, I am now WIPING THE ENTIRE DATABASE');
                console.log('so that you start clean');
                console.log('***********************************************************');
                //If this is a test and we connected to the test db,
                //wipe everything so we start clean
                mongoose.connection.db.dropDatabase();
            }
        })
        .catch(function(err) {
            console.log('Error connecting Mongoose up: ', err); 
            setTimeout(connectDB, 5000); //Try again in 5 seconds
        });
    };
    connectDB();

    // Server port
    var port = process.env.PORT || 8080;

    // get all data/stuff of the body (POST) parameters
    // parse application/json
    app.use(bodyParser.json());

    // parse application/vnd.api+json as json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
    app.use(methodOverride('X-HTTP-Method-Override'));

    // set the static files location /public/img will be /img for users
    app.use(express.static(__dirname + '/public'));

    //Select morgan log style based on server
    if(!process.env.ENVIRONMENT || process.env.ENVIRONMENT === 'dev') {
        app.use(morgan('dev'));
    } else {
        app.use(morgan('common'));
    }


    //Set up the api endpoints
    require(__dirname + '/app/api/api').init(express, app);

    //Default route
    app.get('*', function(req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load our public/index.html file
    });

    //Initialize the school data if necessary
    require(__dirname + '/app/scripts/schools');

    // Start App
    app.listen(port);

    console.log('Server running on ' + port);
}());
