const express = require('express');
const app = express()
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set('view engine', 'ejs');
app.use(express.json())

const port = 3000
const LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
var passport = require('passport')
var passportLocalMongoose = require('passport-local-mongoose')


const mongoose = require('mongoose');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: false }
}))

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect(
  `mongodb+srv://swe363:swe363@cluster0.vzavf7e.mongodb.net/?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
// mongoose.connect('mongodb+srv://swe363:swe363@cluster0.vzavf7e.mongodb.net/?retryWrites=true&w=majority');

//item data base

const itemSchema= new mongoose.Schema({
  category: String, 
  name: String, 
  price: Number, 
  building: String, 
  description: String, 
  ownerName:String,
  itemPhoto: {
    data: Buffer,
    contentType: String,
    path: String
  },
  owner:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  
  });
const Item = mongoose.model('Item',itemSchema );

// user data base 

const userSchema= new mongoose.Schema({
   email: String , 
   password:String, 
   items:[{ type: mongoose.Schema.Types.ObjectId, 
    ref: 'Item' }] }); //items:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User',userSchema );
passport.use(User.createStrategy());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






//          routing 
app.get('/', async (req, res) => { 
  const found=await Item.find({})
  // console.log( found);
    res.render('index', {items:found});  
  })
app.get('/login', async (req, res) => { 
      res.render('loginAndreg');  
})

app.get('/register', async (req, res) => { 
        res.render('loginAndreg');  
    })

    app.get('/myItems', async (req, res) => { 
      if(req.isAuthenticated()){
        let userId = req.user.id;
        const items = await Item.find({ owner: userId });
        res.render('items',{items , userId}); 
        // console.log('done');
      }else{
        res.redirect('/login')
      }
      
  })
    app.get('/api/items',async (req,res) => {
        let userId = req.user.id;
        const items = await Item.find({ owner: userId });
        res.json(items);
    })

    app.get('/api/items/:id', async (req, res) => {
      try {
        const item = await Item.findById(req.params.id);
        if (item) {
          res.json(item);
        } else {
          res.status(404).send();
        }
      } catch (error) {
        res.status(500).send(error);
      }
    });
    

    app.patch('/api/items/:id', async (req,res) => {
      const item = await Item.findById(req.params.id);
      item.name = req.body.name;
      item.price = req.body.price;
      item.description = req.body.description;
      const updatedItem = await item.save();
      res.json(updatedItem);
    })

    app.delete('/api/items/:id', async (req, res) => {
      try {
        const result = await Item.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 1) {
          // If the document was successfully deleted
          res.status(204).send();
        } else {
          // If the document was not found
          res.status(404).send();
        }
      } catch (error) {
        // If an error occurred
        res.status(500).send(error);
      }
    });
 

    app.get('/sell', async (req, res) => { 
        // console.log(req.isAuthenticated());
        if(req.isAuthenticated()){
            res.render('additem'); 
          }else{
            res.redirect('/login')
          }
    })
    app.get("/select", async (req, res)=> {
       const found=await Item.find({})
      var label;
      let filteredObjects;
      const selections = {
        Electronics: ["laptop", "phone", "tablet","headphones","speakers","tv","camera"],
        Furniture: ["desk", "chair", "bed","couch"],
        Clothing: ["shirt", "pants", "shoes"],
        Books: ["textbook", "novel"]
      };
      const selected = req.query.selected;
      if(selected==1){
        label="Electronics";
      }else if (selected==2){
        label="Furniture";
      }else if (selected==3){
        label="Clothing";
      }else if (selected==4){
        label="Books";
      }else{
        label="other"
      }
      if(label=="other"){
        filteredObjects = found;
      }else{
        filteredObjects = found.filter(object => selections[label].includes(object.category));
      }
    res.json(filteredObjects);  
    });
    app.get("/email", async (req, res) => {
      const selected = req.query.email;
      console.log("server side"+selected);
      const user = await User.findById(selected);
      console.log("server Side "+ user);
      res.json(user);
    });


    app.post('/register', async (req, res) => { 
        
        const username=req.body.username;
    
        const password=req.body.password;
        User.register({username: username}, password, function(err, user) {
          if (err) { 
            res.redirect('/register')
           } 
           req.login(user, function(err) {
            if (err) {
              console.log(err);
              res.redirect('/login');
            } else {
              // console.log('User has been logged in after registration');
              res.redirect('/');
            }


             });
          
        });
        // const authenticate = User.authenticate();
        //   authenticate(username, password, function(err, result) {
        //     if (err) { console.log("reg error") }
        
        //     else{res.redirect('/')}
        //   });
          // req.login({username: username}, password, function(err) {
          //   if (err) { console.log(req.isAuthenticated()); }
          //   console.log(req.isAuthenticated());
          
          // });
          
          // passport.authenticate('local', {
          //   successRedirect: '/',
          //   failureRedirect: '/login',
          // })
      })

      const uploadImage = multer({ dest: 'public/uploadedImages/' });

      app.post('/upload', uploadImage.single('itemPhoto'), async (req, res) => {
        const itemId= new mongoose.Types.ObjectId();
        const foundUser=await User.findOne({_id:req.user.id})
        const newItem = new Item({
          _id:itemId,
          category: req.body.itemCategory,
          name: req.body.itemName,
          price: req.body.itemPrice,
          building: req.body.itemBuilding,
          description: req.body.itemDescription,
          itemPhoto: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
            path: req.file.path
          },
          owner:req.user.id,
          ownerName:foundUser.email
        });   
        newItem.save();
        
        foundUser.items.push(itemId);
        foundUser.save();

        res.redirect('/');
         
      });
      

      app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
      }));
      
      app.get('/data/items',(req,res) => {
        
      })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
      })