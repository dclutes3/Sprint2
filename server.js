if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const port = 3000

const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const mysql = require("mysql2")

const pool = mysql.createPool({ //this is incorrect, so this will not work. we cannot connect to our instance so I don't know the correct crudentials
    host:"database",
    user:"islanders",
    password:"dbpassword",
    database:"islanders",
    connectionLimit:10
});

const users = []

const createPassport = require('./passportConfig')
createPassport(
    passport,
    email => pool.query(`SELECT Email FROM Users WHERE UserID='${userID}'`,(err, res)=>{
        if(err){
            console.log(err);
        } else {
            console.log(res);
        }
    }),
    id => pool.query(`SELECT UserID FROM Users WHERE UserID='${userID}'`,(err, res)=>{
        if(err){
            console.log(err);
        } else {
            console.log(res);
        }
    })
)

app.set('view-engine','ejs')
app.use(express.urlencoded({extended: false}))

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req,res)=> {
    res.render('index.ejs',{ name: req.user.name})
})

app.get('/login', checkNotAuthenticated, (req,res)=> {
    res.render('login.ejs')
})

app.use(express.static('public'))
app.use('/css',express.static(__dirname + "public/css"))
app.use('/js',express.static(__dirname + "public/js"))
app.use('/txt',express.static(__dirname + "public/js"))

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register',checkNotAuthenticated,(req,res)=>{
    res.render('register.ejs')
})

app.post('/register',checkNotAuthenticated, async (req,res) => {
    try {
        test = true
        const hashedPassword = await bcrypt.hash(req.body.password, 8);
        const userID = Date.now().toString();
        pool.query(`SELECT UserID FROM Users WHERE UserID='${userID}'`,(err, res)=>{
            if (res.length==0){
                pool.query(`INSERT INTO Users(UserID,Fname,Lname,Email,CellPhone,HoursDesired,Address,Password) VALUES(${userID},'${req.body.fname}', '${req.body.lname}', '${req.body.email}', '${req.body.cell}', '${req.body.hours}', '${req.body.address}', '${hashedPassword}', );`, function(err,res){
                    if (err) { 
                        throw err 
                    } else {
                        console.log(res);
                    }
                })
            }
        })
        showTables();
        if (test = true){
            res.redirect('/login')
        } else {
            res.redirect('/register')
        }
    } catch(err) {
        res.redirect('/register')
    }
})

app.post('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) {
            return next(err); 
        }
        res.redirect('/login');
    });
});

function checkAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req,res,next){
    if ( req.isAuthenticated()){
        return res.redirect('/login')
    }
    next()
}

app.listen(port, () => console.log(`Listening on port: ${port}...`))