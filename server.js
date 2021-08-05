 require('dotenv').config();

const express          = require("express"),
      mongoose         = require("mongoose"),
      bodyParser       = require("body-parser"),
      session          = require("express-session"),
      validator        = require("express-validator"),
      config           = require("./configs/database"),
      users            = require("./routers/users.js"),
      passport         = require("passport"),
      flash            = require("connect-flash"),
      app              = express();

mongoose.connect(config.database,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db = mongoose.connection;
db.on("error" , console.error.bind(console, "connection error"));
db.once("open" , ()=>{
    console.log('mongoDB is connected...');
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(session({
    secret: 'geheimnes',
    resave: true,
    saveUninitialized:true,
}));

app.use(validator({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift()
        }
        return{
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
app.use(flash());
require("./configs/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());


app.use("/users" , users );


const PORT = process.env.PORT;
app.listen(PORT , ()=> console.log(`server is running on port ${PORT} : <http://localhost:${PORT}>`))