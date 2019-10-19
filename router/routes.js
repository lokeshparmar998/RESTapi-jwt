const express = require('express')
const app = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt =require('bcrypt');
const model = require('../model/model');
const mySecretCode = 'thisIsMyCode'
const JWTsecret = 'this123'
// we can put it in enviorment variable but for now we do this
//add
app.post('/',authenticateToken,async (req,res)=>{
    const product = new model.Product({
        name:req.body.name,
        description:req.body.description
    })
    try{
        const newProduct = await product.save();
        res.json(newProduct);
    }
    catch(err)
    {
        res.status(400).json({message:error.message});
    }
})
//get 
app.get('/',async (req,res)=>{
    
    try{
        const product = await model.Product.find()
        res.json(product);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
})
//get one by id 
app.get('/:id',getProduct,(req,res)=>{
    res.send(res.product)
})
//delete one
app.delete('/:id',authenticateToken,getProduct,async (req,res)=>{
    try{
        await res.product.remove();
        res.json({message:'Deleted Product'})
    }
    catch(error)
    {
        res.json(500).json({message:error.message})

    }
})
//update one
app.patch('/:id',authenticateToken,getProduct,async (req,res)=>{ //updates only what is being passed
    if(req.body.name !=null)
    {
        res.product.name = req.body.name
    }
    if(req.body.description !=null)
    {
        res.product.name = req.body.description
    }
    try{
        const updatedProduct = await res.product.save()
        res.json(updatedProduct)
    }
    catch(error)
    {
        res.status(400).json({message:error.message})
    }
})
// Authentication
app.post('/login',async (req,res)=>{
    
    const user = await model.User.findOne({'username':req.body.username})
    if(user == null)
    {
        res.status(400).send('cannot find user');
    }
    try{
        await bcrypt.compare(req.body.password,user.password,(error,result)=>{
            if(error) 
            {
                console.log('login fail')
                returnres.status(401).json({message:message.error});
            }
            if(result){
                const accessToken = jwt.sign({
                    username: user.username,
                    userId:user._id
                },JWTsecret)
            res.json({accessToken: accessToken})
            }
        })
    }
    catch(err)
    {
        res.status(500).send();
    }
})

app.post('/signup',async (req,res)=>{

    try{
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        const isAdmin = req.body.isAdmin;
        let user = new model.User({
        username: req.body.username,
        password:hashedPassword
    })
   
    if(isAdmin === mySecretCode)
    {
        user.isAdmin = true;
    }
    const newUser = await user.save();
    res.json(newUser);
    }
    catch(err)
    {
        app.json({message:message.err})
    }
    console.log(user.isAdmin)
    console.log(user)


    
    

})
//middel ware to get the product
async function getProduct(req,res,next){
    let product
    try{
        product = await model.Product.findById(req.params.id)
        if(product ==null)
        {
            return res.status(404).json({message: 'Cannot find product'})
        }
    }
    catch(error)
    {
        return res.status(500).json({message: error.message})
    }
    res.product = product
    next()
}
//jwt middelware
function authenticateToken(req,res,next){

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, JWTsecret, function(err, decoded) {       if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });       } else {
        // if everything is good, save to request for use in other routes
        req.userData = decoded;         next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
}
module.exports = app;

