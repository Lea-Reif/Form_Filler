//DEPENDENCIES AREA 
const   bodyParser  = require('body-parser'),
        express     = require('express'),
        helmet      = require('helmet'),
        cors        = require('cors'),
        fs      = require('fs'),
        morgan = require('morgan'),
        port        = 443 || 80;

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
app.use(bodyParser.json({limit: '50mb', extended: true}));

app.get('/', (req,res) => {
    res.json({ here_is: 'YOUR API WORKING :)'});
})
// Setting routes
files.forEach((file)=>{
    file =file.split('.').shift();
    app.use(`/${file}`, require('./routes/'+file));
})

module.exports = {
    app : app,
    port : port
};


