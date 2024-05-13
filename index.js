const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = 8000;

mongoose
.connect('mongodb://127.0.0.1:27017/User')
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('Mongo Error',err));


const UserSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true,
        unique: true,
    },
    userEmail:{
        type: String,
        required: true,
        unique:true,
    },
    userPassword:{
        type:String,
        required:true,
    },
    userTitle:{
        type: String,
    },
    
},{timestamps:true})

const User = mongoose.model('User',UserSchema);

// middleware

app.use(express.urlencoded({extended:false}))

// Routes
app.get('/users', async (req,res) =>{
    const allDbUser = await User.find({});
    const html = `
    <ul>
    ${allDbUser.map(user => `<li>${user.userName} - ${user.userEmail}</li>`).join("")}
    </ul>
    `
    res.send(html);
})

// Rest API

app.get('/api/users', async (req, res) => {
    const allDbUser = await User.find({}); 
    return res.json(allDbUser);
})

// Dynamic Path Parameter
// /:id -> variable | dynamic


app.route('/api/users/:id').get  (async (req , res) => {
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).json({error:"user not found"});
    return res.json(user);
}).patch( async (req, res) => {
    // edit user with id
     await User.findByIdAndUpdate(req.params.id,{userName: 'GopalaChanged' })
    return res.json({status: "Success"});
}).delete(async (req, res) =>{
    await User.findByIdAndDelete(req.params.id);
    // delete user with id
    return res.json({status: "Success"});
})


app.post('/api/users', async (req , res) => {
    const body = req.body;
    console.log("Body",body);
    if(
       !body || !body.user_Name || !body.user_Email || !body.user_Password || !body.user_Title 
    ){
       // console.log(body.userName)
        return res.status(400).json({msg:"All fields are required..."})
    }
   const result =  await User.create({
        userName: body.user_Name,
        userEmail: body.user_Email,
        userPassword: body.user_Password,
        userTitle: body.user_Title,
    })
    
    return res.status(201).json({msg: "success"})
})


app.listen(PORT,()=>
    console.log(`Server Started at PORT:${PORT}`)
)
