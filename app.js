const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set('view engine', 'ejs');
const port = 3000
const LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
var passport = require('passport')
var passportLocalMongoose = require('passport-local-mongoose')

const mongoose = require('mongoose');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(passport.initialize());
app.use(passport.session());



mongoose.connect('mongodb://127.0.0.1:27017/S2SDb');

//item data base

const itemSchema= new mongoose.Schema({ category: String , name:String , price: Number , building:String ,description:String,img:
    {
        data: Buffer,
        contentType: String
    }  });
const Item = mongoose.model('Item',itemSchema );

// user data base 

const userSchema= new mongoose.Schema({ email: String , password:String }); //items:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User',userSchema );
passport.use(User.createStrategy());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//          routing
app.get('/', async (req, res) => { 
    res.render('index');  
  })
app.get('/login', async (req, res) => { 
      res.render('login');  
})

app.get('/register', async (req, res) => { 
        res.render('register');  
    })
    app.get('/sell', async (req, res) => { 
        console.log(req.isAuthenticated());
        if(req.isAuthenticated()){
            res.render('additem'); 
          }else{
            res.redirect('/login')
          }
    })
    app.post('/register', async (req, res) => { 
        
        const username=req.body.username;
    
        const password=req.body.password;
        User.register({username: username}, password, function(err, user) {
          if (err) { 
            res.redirect('/register')
           } 
        
          const authenticate = User.authenticate();
          authenticate(username, password, function(err, result) {
            if (err) {  }
        
            else{res.redirect('/')}
          });
        });
        
       
      })
      app.post("/login", function(req, res){

        const user = new User({
          username: req.body.username,
          password: req.body.password
        });
        req.login(user, function(err) {
            if (err) {   console.log(err);}
            else{res.redirect('/');
        }
             
          });

      
      });

    

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
      })