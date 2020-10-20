//DEPENDENCIES AREA 
const   bodyParser  = require('body-parser'),
        express     = require('express'),
        helmet      = require('helmet'),
        cors        = require('cors'),
        fs      = require('fs'),
        morgan = require('morgan'),
        port        = process.env.PORT || 5000;

var routesDir = './app/routes/';
var files = fs.readdirSync(routesDir);


//Default Variables area
var app = express();

app.use(morgan('tiny'));
//Setting CORS
app.use(cors());
//Setting headers
app.use(helmet());

//setting parser
app.use(bodyParser.json());


// Setting routes
files.forEach((file)=>{
    file =file.split('.').shift();
    app.use(`/${file}`, require('./routes/'+file));
})

module.exports = {
    app : app,
    port : port
};


