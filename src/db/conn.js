const mongoose = require ('mongoose');

mongoose.connect('mongodb://localhost:27017/register',{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4,
}).then(()=>{
    console.log("connection success")
}).catch((e)=>{
    console.log(e)
})
