// 

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./views/middlware')

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser('secret'));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Middleware to protect routes

const dummyUser = {
  email: 'user@example.com',
  password: 'password123'
};

// Route for rendering the home page
app.get('/success-page', authMiddleware, (req, res) => {
  try {
    console.log(req.session.user);
    res.render('index', { user: req.session.user });

  } catch (err) {
    console.log(err);
    console.log("success error");
  }
})

app.get('/login', (req, res) => {
  console.log("okay");
  res.render('login');
});

// Route for handling login form submission
app.post('/login', (req, res) => {
  console.log("Received login request");
  console.log("Request Headers:", req.headers); // Log request headers
  console.log("Request Body:", req.body);
  const { email, password } = req.body;


  if (email === dummyUser.email && password === dummyUser.password) {
    req.session.user = { email };
    res.cookie('userEmail', email, { signed: true });
    res.redirect('/success-page')


  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

app.get('/dashboard', authMiddleware, (req, res) => {
  const userData = {
    email: req.session.user.email
  };
  res.render('dashboard', { user: userData });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
