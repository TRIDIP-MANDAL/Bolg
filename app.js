const express = require('express');
const app = express();
const session = require('express-session');
const loginRouter = require('./src/routes/login');
const authorRouter = require('./src/routes/author');
const adminRouter = require('./src/routes/admin');
const articleRouter = require('./src/routes/articles');
const homeRouter = require('./src/routes/home');
const mongoose = require('mongoose');
app.use(express.urlencoded());
app.use(express.json());
// require('dotenv').config();

mongoose.connect("mongodb+srv://tridipyza90:tridip@cluster.y4fpa.mongodb.net/BlogDB?retryWrites=true&w=majority&appName=Cluster")

app.listen(8080);

app.set('view engine','ejs');
app.set('views','./src/views')

app.use(session({
    resave:false,
    saveUninitialized:true,
    secret:'keyboard'
}));


app.use(express.static('./public'))

app.use('/',loginRouter);

const userAuth = (req,res,next)=>{
    
    if(req.session && req.session.user){
        next()
    }
    else{
        res.redirect('/login');
    }
}

const adminAuth = (req,res,next)=>{
    if(req.session.user.role=='admin'){
        next();
    }
    else{
        res.send('Invalid access')
    }
}

const authorAuth = (req,res,next)=>{
    if(req.session.user.role=='author'){
        next();
    }
    else{
        res.send('Invalid access')
    }
}
app.use('/',homeRouter);
app.use('/admin',userAuth,adminAuth,adminRouter);
app.use('/author',userAuth,authorAuth,authorRouter)
app.use('/article',userAuth,articleRouter);

