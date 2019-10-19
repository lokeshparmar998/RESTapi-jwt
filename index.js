const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routes = require('./router/routes')
const jwt = require('jsonwebtoken');
const bcrypt =require('bcrypt')

//connection to db
mongoose.connect('mongodb://localhost/NodeAssigmentDB',{useNewUrlParser: true})

var db = mongoose.connection
db.on('error', (error)=>{
    console.error(error)
});
db.once('open', function() {
  console.log("We are connected to the The DB");
});
app.use(express.json()) //server accepts json
app.use('/user',routes);

app.listen(3000,()=>{
    console.log('server up and running');
})