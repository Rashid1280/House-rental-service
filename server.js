const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
 


//get all files

require('./src/db/conn')
const Register = require('./src/models/registers');
const propertyModel = require('./src/models/addProperty');

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static('./public'));
app.set("view engine", "hbs");

app.get('/',(req,res)=>{
res.render("login");
console.log(req.query)
})

app.get('/login',(req,res)=>{
    res.render("login");
    })

app.get('/register',(req,res)=>{
    res.render('register');
    console.log(req.query)

})

app.get('/index',(req,res)=>{
    res.render('index');
    console.log(req.query)

})
//add property

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 } 
}).single('images');

app.get('/addProperty', (req, res) => {
  res.render('addProperty');
});

app.post('/addProperty', (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error(err);
      next(err);
    } else {
      try {
        const propertyDetails = new propertyModel({
          propertyType: req.body.propertyType,
          description: req.body.description,
          location: req.body.location,
          address: req.body.address,
          price: req.body.price,
          ownerNo: req.body.ownerNo,
          images: req.file.path
        });

        await propertyDetails.save();
        const data = await propertyModel.find().exec();
        res.render('propertyAdded', { title: 'addProperty', records: data });
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  });
});


// creating userdata
app.post('/register',async (req,res)=>{
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if(password===cpassword){
             const registerEmployee = new Register({
                Username : req.body.Username,
                email : req.body.email,
                password : req.body.password,
                cpassword : req.body.cpassword,
           })
        //    registerEmployee.save()
           const registered = await registerEmployee.save();
           res.status(201).render('login');
        }else{
            res.send("<h1>PLEASE MATCH THE PASSWORDS....</h1>")
        }
    } catch (error) {
        res.status(404).send(error)
    }

})

app.post('/login',async (req,res)=>{
   
    try {
        
       const email = req.body.email;
       const password = req.body.password;

       const userMail = await Register.findOne({email:email});
       if(userMail.password === password){
        res.status(201).render('index');
       }else{
        res.send("<h1>INVALID CREDENTIALS. PLEASE TRY AGAIN....</h1>")
       }

    } catch (error) {
        res.status(400).send("invalid email")
    }

    })

//////////////////////////////////////////////////////////////////////////////////////////////
app.get('/properties', async (req, res, next) => {
  try {
    const properties = await propertyModel.find().exec(); // Fetch all the properties from MongoDB

    res.render('properties', { title: 'All Properties', properties: properties });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

////////////////////////////////////////////////////////////////////////////////////////////
app.get('/search', async (req, res, next) => {
  try {
    const propertyType = req.query.propertyType;
    const location = req.query.location;

    const results = await propertyModel.find({ propertyType, location }).exec();

    res.render('searchResults', { title: 'Search Results', properties: results });
  } catch (error) {
    console.error(error);
    next(error);
  }
});







app.all('*',(req,res)=>{
    res.status(404).send("<h1>resource not found</h1>")
})

app.listen(5000,()=>{
    console.log("hit port 5000")
})

