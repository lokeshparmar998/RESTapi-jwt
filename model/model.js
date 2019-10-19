const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    }

})
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }

})
const User = mongoose.model('User',userSchema);

const Product = mongoose.model('Product',productSchema);
module.exports = {
    User:User,
    Product:Product
}
