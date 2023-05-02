const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const crypto = require('crypto');
const session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

app.use(session({
    key: "session_cookie_name",
    secret: "session_secret_name",
    store: new MySQLStore({
        host:"ec2-3-19-238-216.us-east-2.compute.amazonaws.com",
        user:"islanders",
        password:"800monkeys",
        database:"islanders"
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*24,

    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.set('view engine','ejs');

var connection = mysql.createConnection({
    host:"ec2-3-19-238-216.us-east-2.compute.amazonaws.com",
    user:"islanders",
    password:"800monkeys",
    database:"islanders",
    multipleStatements: true
});

connection.connect((err) => {
    if (!err) {
        console.log("Connected to Database 'islanders'!\n");
    } else {
        console.log("Connection Failed.\n");
    }
});

const customFields={
    usernameField: 'uname',
    passwordField: 'pw'
};

const verifyCallback=(email,password,done)=>{
    connection.query(`SELECT * FROM Users WHERE Email = '${email}';`, function(err, results, fields){
        console.log(`SELECT * FROM Users WHERE Email = '${email}';`);
        console.log("email: "+email);
        console.log("fields: "+ fields);
        console.log("results: " + results[0]);
        console.log(results[0].salt);
        if(err){
            return done(err);
        }
        if (results.length==0){
            return done(null, false);
        }
        const isValid = validPassword(password,results[0].hash,results[0].salt);
        user = {
            id: results[0].id,
            email: results[0].email,
            hash: results[0].hash,
            salt: results[0].salt
        };
        if(isValid){
            return done(null,user);
        } else {
            return done(null,false);
        }
    });
}

const strategy = new LocalStrategy(customFields,verifyCallback);
passport.use(strategy);

passport.serializeUser((user,done)=>{
    console.log("inside serialize");
    done(null,user.id)
})

passport.deserializeUser(function(userId,done){
    console.log("deserialize " + userId);
    connection.query("SELECT * FROM Users WHERE UserId = ? ",userId, function(err,results){
        done(null, results[0]);
    });
});

function validPassword(password,hash,salt){
    console.log("salt: "+ salt);
    var hashVerify = crypto.pbkdf2Sync(password,salt,10000,60,'sha512').toString('hex');
    return hash === hashVerify;
};

function genPassword(password){
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
    return {salt: salt, hash: genHash}
};

function isAuth(req,res,next){
    if (req.isAuthenticated()){
        next()
    } else {
        res.redirect('/notAuthorized');
    }
}

function userExists(req,res,next){
    connection.query("SELECT * FROM Users WHERE email = ? ", [req.body.uname], function(err, results, fields){
        if(err){
            console.log(err);
        } else if(results.length>0){
            res.redirect("/userAlreadyExists");
        } else (
            next()
        )
    });
};

app.get('/', (req,res,next)=>{
    res.send("<h1>Home</h1><p>Please <a href='/register'>Register</a></p>");
});

app.get('/login', (req,res,next)=>{
    res.render('login');
});

app.get('logout', (req,res,next)=>{
    req.logout();
    res.redirect('/protected-route');
});

app.get('/login-success', (req,res,next)=>{
    res.send("<p>You have successfully logged in. --> <a href='/protected-route'>Go to protected route</a></p>");
});

app.get('login-failure', (req,res,next)=>{
    res.send("Incorrect Password");
});

app.get('/register', (req,res,next)=>{
    console.log("inside get register");
    res.render('register');
});

app.post('/register', userExists, (req,res,next)=>{
    console.log("inside post");
    console.log(req.body.pw);
    const saltHash = genPassword(req.body.pw);
    console.log(saltHash);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const userID = Date.now().toString();
    connection.query('INSERT INTO Users(UserID,Fname,Lname,Email,CellPhone,HoursDesired,Address,Hash,Salt) VALUES(?,?,?,?,?,?,?,?,?);',[userID,req.body.fname,req.body.lname,req.body.uname,req.body.cell,req.body.hours,req.body.address,hash,salt],function(err,results,fields){
        if(err){
            console.log(err);
        } else {
            console.log("user added");
        }
    });
    res.redirect('/login');
});

app.post('/login', passport.authenticate('local',{failureRedirect: '/login-failure', successRedirect: '/login-success'}));

app.get('/protected-route', isAuth,(req,res,next)=>{
    res.send('<h1>You Are Authenticated</h1><p><a href="/logout">Logout and Reload</a></p>');
});

app.get('/not-authorized',(req,res,next)=>{
    res.send("<h1>You are not authorized to view this resource</h1><p><a href='/login'>Retry Login</a></p>");
});

app.get('/userAlreadyExists',(req,res,next)=>{
    res.send("<h1>This email already exists</h1><p><a href='/register'>Retry with different email</a></p>");
});

app.listen(3000,function(){
    console.log("Listening on port 8080");
});