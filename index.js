const { config, engine } = require('express-edge');
const express=require('express');
const mongoose= require('mongoose');
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require('path')
const Post = require('./database/models/Post')
const User= require('./database/models/User');
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const edge = require("edge.js");
const mongoStore =new connectMongo(expressSession);

const auth = require("./middleware/auth");

const connectFlash = require("connect-flash");

const app=new express();

app.use(connectFlash());

app.use(expressSession({
    secret: 'secret'
}));
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')
const createUserController = require("./controllers/createUser");
const storeUserController = require('./controllers/storeUser');
const loginController = require("./controllers/login");
const loginUserController = require('./controllers/loginUser');
const logoutController = require("./controllers/logout");


// Database Connection with MongoDB
mongoose.connect('mongodb://localhost:27017/blog-db', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))




app.use(expressSession({
        secret: 'secret',
        store: new mongoStore({
            mongooseConnection: mongoose.connection
        })
    }));


app.use(fileUpload());
app.use(express.static('public'));
app.use(engine);
app.set('views', __dirname + '/views');
app.use('*', (req, res, next) => {
    edge.global('auth', req.session.userId)
    next()
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

const storePost = require('./middleware/storePost')
app.use('/posts/store', storePost)

app.get('/', async (req, res) => {
    const posts = await Post.find({})
    res.render('index', {
        posts
    })
});


// create a blog 
app.get('/new',auth, (req, res) => {
    if (req.session.userId) {
        return res.render("create");
    }

    res.redirect('/login')  
});

// Post a blog on the database via http req
app.post("/posts/store",auth, (req, res) => {
    const {
        image
    } = req.files

    image.mv(path.resolve(__dirname, '/public', image.name), (error) => {
        Post.create({
            ...req.body,
            image: `/posts/${image.name}`
        }, (error, post) => {
            res.redirect('/');
        });
    })
});
app.get("/register", redirectIfAuthenticated,createUserController);
app.post("/users/register",redirectIfAuthenticated, storeUserController);

app.get('/login',redirectIfAuthenticated, loginController);

app.post('/users/login',redirectIfAuthenticated, loginUserController);


// get the an blog
app.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('post', {
        post
    })
});


app.get("/logout", redirectIfAuthenticated, logoutController);

app.listen(4000,()=>{
    console.log('App is running on port 4000');
});